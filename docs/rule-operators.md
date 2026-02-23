# Rule Operators

List of supported operators for rule conditions.

## Basic Operators

- `equals` (`eq`) - Exact match
- `not equals` (`ne`) - Not equal
- `greater than` (`gt`) - Numeric comparison
- `less than` (`lt`) - Numeric comparison
- `greater than or equal` (`gte`) - Numeric comparison
- `less than or equal` (`lte`) - Numeric comparison

## Array Operators

- `in` - Check if value exists in array (e.g., `product.tags.id IN [tag-1, tag-2]`)
- `not in` - Check if value does not exist in array
- `contains` - Check if array contains value (partial match)
- `not contains` - Check if array does not contain value

## Null Checks

- `empty` - Check if value is null or empty
- `not empty` - Check if value is not null or empty

## See Also

- [Configuration](./configuration.md)
