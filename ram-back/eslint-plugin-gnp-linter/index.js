// (c) Delta Software 2023, rights reserved.

module.exports = {
  rules: {
    "database-compat": {
      meta: {
        type: "error",
        docs: {
          description: "Database compatibility lint",
        },
        messages: {
          "invalid-column-definition":
            "Column definitions must be uppercase and end with _COLUMN",
          "invalid-column-options":
            "Column options should be a COLUMN constant defined in the columns.ts file",
          "entity-class-name": "Entity classses should end with 'Ent'",
          "entity-file-name": "Entity files should end with '.entity.ts'",
          "column-data-type":
            "Column data types should be one of INT, VARCHAR, UUID, or DATE",
        },
      },
      create: function (context) {
        const filename = context.getFilename();

        // used on .entity.ts files
        const columnChecker = (node) => {
          const className = node.id.name;
          const isEntityClass = className.endsWith("Ent");

          if (!isEntityClass) {
            return;
          }

          const properties = node.body.body;
          const columnDecorators = ["Column", "PrimaryColumn"];

          const isColumnDecorator = (decorator) =>
            columnDecorators.includes(decorator.expression.callee.name);

          const columnOptions = properties
            .map((property) => property.decorators)
            .filter((x) => x)
            .flat()
            .filter(isColumnDecorator)
            .filter((decorator) => decorator.expression.arguments.length > 0)
            .map((decorator) => {
              const parameters = decorator.expression.arguments;
              const options = parameters[0];

              return options;
            });

          columnOptions.forEach((option) => {
            // we allow identifiers or function calls

            if (
              option.type !== "Identifier" &&
              option.type !== "CallExpression"
            ) {
              context.report({
                node: option,
                messageId: "invalid-column-options",
              });
              return;
            }

            const name = option.name || option.callee.name;

            if (!name.endsWith("_COLUMN")) {
              context.report({
                node: option,
                messageId: "invalid-column-options",
              });
            }
          });
        };

        const entityClassnameChecker = (node) => {
          const decorators = node.decorators;
          const isEntityClass = decorators.some(
            (decorator) => decorator.expression.callee.name === "Entity",
          );

          if (!isEntityClass) return;

          const className = node.id.name;
          const isEntityClassName = className.endsWith("Ent");

          if (!isEntityClassName) {
            context.report({
              node,
              messageId: "entity-class-name",
            });
          }
        };

        const filenameChecker = (node) => {
          const decorators = node.decorators;
          const isEntityClass = decorators.some(
            (decorator) => decorator.expression.callee.name === "Entity",
          );

          if (!isEntityClass) return;

          if (!filename.endsWith(".entity.ts")) {
            context.report({
              node,
              messageId: "entity-file-name",
            });
          }
        };

        if (filename.endsWith("columns.ts")) {
          const exportConsts = context
            .getSourceCode()
            .ast.body.filter(
              (node) =>
                node.type === "ExportNamedDeclaration" &&
                node.declaration.type === "VariableDeclaration",
            );

          // all exports must be uppercase and end with _COLUMN
          exportConsts.forEach((node) => {
            const name = node.declaration.declarations[0].id.name;

            if (!name.endsWith("_COLUMN")) {
              context.report({
                node,
                messageId: "invalid-column-definition",
              });
            }

            if (name !== name.toUpperCase()) {
              context.report({
                node,
                messageId: "invalid-column-definition",
              });
            }
          });

          exportConsts
            .map((node) => {
              // we can have objects or arror functions that return objects
              if (
                node.declaration.declarations[0].init.type ===
                "ObjectExpression"
              )
                return node.declaration.declarations[0].init;

              if (
                node.declaration.declarations[0].init.type ===
                "ArrowFunctionExpression"
              )
                return node.declaration.declarations[0].init.body;

              context.report({
                node,
                messageId: "invalid-column-definition",
              });
            })
            .filter((x) => x)
            .forEach((object) => {
              const type = object.properties.find(
                (property) => property.key.name === "type",
              );

              if (!type) {
                context.report({
                  node: object,
                  messageId: "column-data-type",
                });
                return;
              }

              const allowedTypes = ["INT", "VARCHAR", "DATE", "UUID"];

              if (!allowedTypes.includes(type.value.value.toUpperCase())) {
                context.report({
                  node: type,
                  messageId: "column-data-type",
                });
              }
            });
        }

        return {
          ClassDeclaration: (node) => {
            if (filename.endsWith(".entity.ts")) {
              columnChecker(node);
              entityClassnameChecker(node);
            } else {
              filenameChecker(node);
            }
          },
        };
      },
    },
  },
};
