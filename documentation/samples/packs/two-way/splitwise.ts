import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

const CategorySchema = coda.makeObjectSchema({
  properties: {
    categoryId: {
      description: "A unique ID for the category.",
      type: coda.ValueType.Number,
      fromKey: "id",
      required: true,
    },
    name: {
      description: "The name of the category.",
      type: coda.ValueType.String,
      required: true,
    },
    icon: {
      description: "An icon representing the category.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
  },
  displayProperty: "name",
});

const ExpenseSchema = coda.makeObjectSchema({
  properties: {
    expenseId: {
      description: "A unique ID for the expense.",
      type: coda.ValueType.String,
      fromKey: "id",
    },
    description: {
      description: "The description of the expense.",
      type: coda.ValueType.String,
      mutable: true,
    },
    date: {
      description: "The date the expense was made.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
      mutable: true,
    },
    cost: {
      description: "The total cost of the expense.",
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Currency,
      mutable: true,
    },
    notes: {
      description: "Any notes on the expense.",
      type: coda.ValueType.String,
      fromKey: "details",
      mutable: true,
    },
    repeat: {
      description: "How often the expense automatically repeats.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.SelectList,
      fromKey: "repeat_interval",
      mutable: true,
      // Static list of options.
      options: ["never", "weekly", "fortnightly", "monthly", "yearly"],
    },
    currency: {
      description: "The code of the currency of the expense.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.SelectList,
      fromKey: "currency_code",
      mutable: true,
      // Dynamic list of options.
      options: async function (context) {
        // Fetch the list of supported currencies.
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://secure.splitwise.com/api/v3.0/get_currencies",
        });
        return response.body.currencies.map(currency => currency.currency_code);
      },
    },
    category: {
      ...CategorySchema,
      codaType: coda.ValueHintType.SelectList,
      mutable: true,
      // Dynamic list of options, as objects.
      options: async function (context) {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://secure.splitwise.com/api/v3.0/get_categories",
        });
        let categories = response.body.categories;
        let result = [];
        for (let category of categories) {
          result.push(category);
          let subcategories = category.subcategories || [];
          for (let subcategory of subcategories) {
            if (subcategory.name === "Other") {
              // Add the parent category's name in front, to distinguish it.
              subcategory.name = `${category.name} - ${subcategory.name}`;
            }
            result.push(subcategory);
          }
        }
        return result;
      },
    },
  },
  displayProperty: "description",
  idProperty: "expenseId",
  featuredProperties: [
    "date", "cost", "notes", "currency", "repeat", "category",
  ],
});

pack.addSyncTable({
  name: "Expenses",
  description: "Lists your expenses.",
  identityName: "Expense",
  schema: ExpenseSchema,
  formula: {
    name: "SyncExpenses",
    description: "Syncs the data.",
    parameters: [],
    execute: async function (args, context) {
      let [] = args;
      let offset = context.sync.continuation?.offset as number || 0;
      let limit = 20;
      let url = coda.withQueryParams(
        "https://secure.splitwise.com/api/v3.0/get_expenses",
        {
          offset: offset,
          limit: limit,
        }
      );
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let expenses = response.body.expenses;

      let continuation;
      if (expenses.length === limit) {
        offset += limit;
        continuation = { offset: offset };
      }

      return {
        result: expenses,
        continuation: continuation,
      };
    },
    maxUpdateBatchSize: 10,
    executeUpdate: async function (args, updates, context) {
      // Make all of the updates in parallel to improve performance.
      let jobs = updates.map(async update => {
        return updateExpense(context, update);
      });
      let completed = await Promise.allSettled(jobs);
      let results = completed.map(job => {
        if (job.status === "fulfilled") {
          return job.value;
        } else {
          return job.reason;
        }
      });
      return {
        result: results,
      };
    },
  },
});

async function updateExpense(context: coda.ExecutionContext,
  update: coda.GenericSyncUpdate) {
  let expense = update.newValue;

  // Only include fields in the body that have been updated.
  // The API will throw an error if you include fields that can't be modified.
  let body: Record<string, any> = {};
  for (let field of update.updatedFields) {
    if (field === "category") {
      // Only send the category ID when updating it.
      body.category_id = expense.category.id;
    } else {
      body[field] = expense[field];
    }
  }

  try {
    let response = await context.fetcher.fetch({
      method: "POST",
      url: `https://secure.splitwise.com/api/v3.0/update_expense/${expense.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let result = response.body;
    return result.expenses[0];
  } catch (e) {
    // If the API returned an error, show that error to the user.
    if (coda.StatusCodeError.isStatusCodeError(e)) {
      let errors = Object.values(e.body.errors).flat();
      if (errors?.length > 0) {
        throw new coda.UserVisibleError(errors.join("\n"));
      }
    }
    throw e;
  }
}

pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://secure.splitwise.com/oauth/authorize",
  tokenUrl: "https://secure.splitwise.com/oauth/token",
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://secure.splitwise.com/api/v3.0/get_current_user",
    });
    let user = response.body.user;
    return `${user.first_name} ${user.last_name}`;
  },
});

pack.addNetworkDomain("splitwise.com");
