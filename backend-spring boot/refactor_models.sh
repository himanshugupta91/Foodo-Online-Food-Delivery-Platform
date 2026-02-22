#!/bin/bash
set -e

# Base directory
BASE_DIR="/Users/himanshu/Downloads/Foodo/backend-spring boot/src/main/java/com/himanshu"

cd "$BASE_DIR"

echo "Creating new directories..."
mkdir -p model/dto
mkdir -p model/entities
mkdir -p model/enums

echo "Moving DTOs..."
mv dto/*.java model/dto/
rmdir dto

echo "Moving Enums..."
mv model/OrderStatus.java model/enums/
mv model/UserRole.java model/enums/

echo "Moving Entities..."
mv model/*.java model/entities/

echo "Updating Package Declarations..."
find model/dto -name "*.java" -exec sed -i '' 's/package com\.himanshu\.dto;/package com.himanshu.model.dto;/g' {} +
find model/entities -name "*.java" -exec sed -i '' 's/package com\.himanshu\.model;/package com.himanshu.model.entities;/g' {} +
find model/enums -name "*.java" -exec sed -i '' 's/package com\.himanshu\.model;/package com.himanshu.model.enums;/g' {} +

echo "Updating DTO References globally..."
find . -name "*.java" -exec sed -i '' 's/com\.himanshu\.dto/com.himanshu.model.dto/g' {} +

echo "Updating Enum References globally..."
find . -name "*.java" -exec sed -i '' 's/com\.himanshu\.model\.OrderStatus/com.himanshu.model.enums.OrderStatus/g' {} +
find . -name "*.java" -exec sed -i '' 's/com\.himanshu\.model\.UserRole/com.himanshu.model.enums.UserRole/g' {} +

echo "Updating Entity References globally..."
ENTITIES=("Address" "Cart" "CartItem" "Category" "ContactInformation" "Coupon" "Events" "Food" "Ingredient" "IngredientCategory" "IngredientsItem" "Notification" "Order" "OrderItem" "PasswordResetToken" "Payment" "Restaurant" "Review" "User")
for ENTITY in "${ENTITIES[@]}"; do
  find . -name "*.java" -exec sed -i '' "s/com\.himanshu\.model\.${ENTITY}/com.himanshu.model.entities.${ENTITY}/g" {} +
done

echo "Updating wildcard model imports globally..."
find . -name "*.java" -exec sed -i '' 's/import com\.himanshu\.model\.\*;/import com.himanshu.model.entities.*;\nimport com.himanshu.model.enums.*;/g' {} +

echo "Refactoring completed successfully."
