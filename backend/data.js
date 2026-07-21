/**
 * Professional Dummy Data for Restaurant POS
 * Total Records: 100+
 */

const data = {
    // 1. Categories (8 records)
    categories: [
        { name: "Appetizers", description: "Starter dishes to whet your appetite", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800", status: "active" },
        { name: "Main Course", description: "Hearty and delicious primary dishes", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800", status: "active" },
        { name: "Beverages", description: "Refreshing drinks and mocktails", image: "https://images.unsplash.com/photo-1544145945-f904253d0c7e?auto=format&fit=crop&q=80&w=800", status: "active" },
        { name: "Desserts", description: "Sweet treats to end your meal", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800", status: "active" },
        { name: "Breakfast", description: "The most important meal of the day", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=800", status: "active" },
        { name: "Fast Food", description: "Quick bites and tasty snacks", image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=800", status: "active" },
        { name: "Healthy", description: "Salads and nutritious options", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800", status: "active" },
        { name: "Specialties", description: "Chef's special unique creations", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800", status: "active" }
    ],

    // 2. Menu Items (25 records)
    menuItems: [
        { name: "Crispy Calamari", description: "Golden fried squid rings with spicy aioli", price: 12.99, costPrice: 4.50, categoryName: "Appetizers", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "mild", preparationTime: 12 },
        { name: "Buffalo Wings", description: "Classic spicy chicken wings with blue cheese dip", price: 10.99, costPrice: 3.80, categoryName: "Appetizers", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "hot", preparationTime: 15 },
        { name: "Garlic Bread", description: "Toasted baguette with herb garlic butter", price: 5.99, costPrice: 1.20, categoryName: "Appetizers", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 8 },
        { name: "Grilled Salmon", description: "Atlantic salmon with lemon butter sauce and asparagus", price: 24.99, costPrice: 9.50, categoryName: "Main Course", image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "mild", preparationTime: 25 },
        { name: "Ribeye Steak", description: "12oz USDA Choice ribeye with roasted potatoes", price: 32.99, costPrice: 14.00, categoryName: "Main Course", image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "medium", preparationTime: 30 },
        { name: "Veggie Pasta", description: "Penne with seasonal vegetables in pesto sauce", price: 16.99, costPrice: 5.20, categoryName: "Main Course", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 18 },
        { name: "Chicken Tikka Masala", description: "Classic creamy tomato curry with tender chicken", price: 18.99, costPrice: 6.00, categoryName: "Main Course", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "medium", preparationTime: 25 },
        { name: "Mushroom Risotto", description: "Arborio rice with wild mushrooms and truffle oil", price: 19.99, costPrice: 6.50, categoryName: "Main Course", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 22 },
        { name: "Classic Cheeseburger", description: "Beef patty, cheddar, lettuce, tomato, and fries", price: 14.99, costPrice: 5.00, categoryName: "Fast Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "mild", preparationTime: 15 },
        { name: "Margherita Pizza", description: "Fresh mozzarella, basil, and tomato sauce", price: 12.99, costPrice: 3.50, categoryName: "Fast Food", image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 20 },
        { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a gooey center", price: 8.99, costPrice: 2.20, categoryName: "Desserts", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 10 },
        { name: "New York Cheesecake", description: "Rich creamy cheesecake with berry compote", price: 7.99, costPrice: 2.00, categoryName: "Desserts", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
        { name: "Virgin Mojito", description: "Fresh mint, lime, and soda water", price: 6.99, costPrice: 1.00, categoryName: "Beverages", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
        { name: "Iced Caramel Macchiato", description: "Espresso with milk and caramel sauce over ice", price: 5.99, costPrice: 1.50, categoryName: "Beverages", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
        { name: "Greek Salad", description: "Feta, olives, cucumber, and tomato with olive oil", price: 11.99, costPrice: 3.00, categoryName: "Healthy", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 10 },
        { name: "Quinoa Bowl", description: "Roasted veggies, quinoa, and lemon tahini dressing", price: 13.99, costPrice: 4.00, categoryName: "Healthy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 15 },
        { name: "Avocado Toast", description: "Sourdough bread with mashed avocado and poached egg", price: 12.99, costPrice: 3.50, categoryName: "Breakfast", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 10 },
        { name: "French Toast", description: "Brioche with maple syrup and fresh berries", price: 10.99, costPrice: 2.80, categoryName: "Breakfast", image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 12 },
        { name: "Fish & Chips", description: "Beer-battered cod with tartare sauce and mushy peas", price: 17.99, costPrice: 5.50, categoryName: "Specialties", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "mild", preparationTime: 18 },
        { name: "Lamb Chops", description: "Herb-crusted lamb chops with mint chimichurri", price: 29.99, costPrice: 12.00, categoryName: "Specialties", image: "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "medium", preparationTime: 25 },
        { name: "Caesar Salad", description: "Romaine lettuce, croutons, parmesan, and Caesar dressing", price: 10.99, costPrice: 2.50, categoryName: "Healthy", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 8 },
        { name: "Shrimp Scampi", description: "Spaghetti with shrimp in garlic lemon butter sauce", price: 21.99, costPrice: 7.50, categoryName: "Main Course", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "mild", preparationTime: 20 },
        { name: "Beef Tacos", description: "Three spicy beef tacos with salsa and guacamole", price: 13.99, costPrice: 4.20, categoryName: "Fast Food", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865597?auto=format&fit=crop&q=80&w=800", isVeg: false, spiceLevel: "hot", preparationTime: 15 },
        { name: "Red Velvet Cupcake", description: "Mini cupcakes with cream cheese frosting", price: 4.99, costPrice: 1.20, categoryName: "Desserts", image: "https://images.unsplash.com/photo-1614707267537-b85af00c4b81?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 5 },
        { name: "Pineapple Juice", description: "Freshly squeezed pineapple juice", price: 4.99, costPrice: 0.80, categoryName: "Beverages", image: "https://images.unsplash.com/photo-1589733901241-5e55426f0d41?auto=format&fit=crop&q=80&w=800", isVeg: true, spiceLevel: "mild", preparationTime: 5 }
    ],

    // 3. Users (12 records)
    users: [
        { name: "Zayn Ahmed", email: "admin@pos.com", password: "password123", role: "admin", pin: "1234", designation: "General Manager", phoneNumber: "1234567890", avatar: "https://i.pravatar.cc/150?u=zayn" },
        { name: "Sarah Khan", email: "sarah@pos.com", password: "password123", role: "manager", pin: "5566", designation: "Floor Manager", phoneNumber: "2345678901", avatar: "https://i.pravatar.cc/150?u=sarah" },
        { name: "John Doe", email: "john@pos.com", password: "password123", role: "cashier", pin: "1111", designation: "Senior Cashier", phoneNumber: "3456789012", avatar: "https://i.pravatar.cc/150?u=john" },
        { name: "Emily Watson", email: "emily@pos.com", password: "password123", role: "cashier", pin: "2222", designation: "Junior Cashier", phoneNumber: "4567890123", avatar: "https://i.pravatar.cc/150?u=emily" },
        { name: "Michael Chen", email: "michael@pos.com", password: "password123", role: "waiter", pin: "3333", designation: "Server", phoneNumber: "5678901234", avatar: "https://i.pravatar.cc/150?u=michael" },
        { name: "Jessica Lee", email: "jessica@pos.com", password: "password123", role: "waiter", pin: "4444", designation: "Server", phoneNumber: "6789012345", avatar: "https://i.pravatar.cc/150?u=jessica" },
        { name: "Robert Brown", email: "robert@pos.com", password: "password123", role: "waiter", pin: "7777", designation: "Server", phoneNumber: "7890123456", avatar: "https://i.pravatar.cc/150?u=robert" },
        { name: "Chef Ramsay", email: "gordon@pos.com", password: "password123", role: "kitchen", pin: "8888", designation: "Head Chef", phoneNumber: "8901234567", avatar: "https://i.pravatar.cc/150?u=gordon" },
        { name: "Alice Chang", email: "alice@pos.com", password: "password123", role: "kitchen", pin: "9999", designation: "Sous Chef", phoneNumber: "9012345678", avatar: "https://i.pravatar.cc/150?u=alice" },
        { name: "David Miller", email: "david@pos.com", password: "password123", role: "kitchen", pin: "1010", designation: "Line Cook", phoneNumber: "0123456789", avatar: "https://i.pravatar.cc/150?u=david" },
        { name: "Fifi Rodriguez", email: "fifi@client.com", password: "password123", role: "client", phoneNumber: "1122334455", avatar: "https://i.pravatar.cc/150?u=fifi" },
        { name: "Sam Wilson", email: "sam@client.com", password: "password123", role: "client", phoneNumber: "2233445566", avatar: "https://i.pravatar.cc/150?u=sam" }
    ],

    // 4. Tables (15 records)
    tables: [
        { name: "Table 01", zone: "Indoor", capacity: 4, status: "Available" },
        { name: "Table 02", zone: "Indoor", capacity: 2, status: "Occupied" },
        { name: "Table 03", zone: "Indoor", capacity: 6, status: "Available" },
        { name: "Table 04", zone: "Indoor", capacity: 4, status: "Reserved" },
        { name: "Table 05", zone: "Bar", capacity: 1, status: "Available" },
        { name: "Table 06", zone: "Bar", capacity: 1, status: "Available" },
        { name: "Table 101", zone: "Outdoor", capacity: 4, status: "Available" },
        { name: "Table 102", zone: "Outdoor", capacity: 4, status: "Occupied" },
        { name: "Table 103", zone: "Outdoor", capacity: 2, status: "Available" },
        { name: "Rooftop 01", zone: "Rooftop", capacity: 4, status: "Available" },
        { name: "Rooftop 02", zone: "Rooftop", capacity: 4, status: "Available" },
        { name: "VIP 01", zone: "VIP Lounge", capacity: 8, status: "Reserved" },
        { name: "VIP 02", zone: "VIP Lounge", capacity: 8, status: "Available" },
        { name: "Booth A", zone: "Indoor", capacity: 4, status: "Available" },
        { name: "Booth B", zone: "Indoor", capacity: 4, status: "Available" }
    ],

    // 5. Clients (15 records)
    clients: [
        { name: "Alex Johnson", email: "alex@gmail.com", phone: "555-0101", totalSpent: 450, preferences: "Allergic to nuts", address: { street: "123 Maple St", city: "New York", zip: "10001" } },
        { name: "Maria Garcia", email: "maria@yahoo.com", phone: "555-0102", totalSpent: 1200, preferences: "Prefers window seating", address: { street: "456 Oak Ave", city: "Brooklyn", zip: "11201" } },
        { name: "Chris Evans", email: "chris@outlook.com", phone: "555-0103", totalSpent: 890, preferences: "Vegan options", address: { street: "789 Pine Rd", city: "Queens", zip: "11101" } },
        { name: "Sarah Parker", email: "sparker@gmail.com", phone: "555-0104", totalSpent: 320, preferences: "Extra spice", address: { street: "101 Elm St", city: "Manhattan", zip: "10012" } },
        { name: "James Bond", email: "007@mi6.gov", phone: "555-0007", totalSpent: 5000, preferences: "Martini, shaken not stirred", address: { street: "Secret Location", city: "London", zip: "SW1A" } },
        { name: "Sophia Lee", email: "sophia@gmail.com", phone: "555-0106", totalSpent: 670, preferences: "Window seat" },
        { name: "Daniel Craig", email: "daniel@gmail.com", phone: "555-0107", totalSpent: 1500, preferences: "Loves desserts" },
        { name: "Emma Stone", email: "emma@gmail.com", phone: "555-0108", totalSpent: 980, preferences: "Non-smoker" },
        { name: "Liam Neeson", email: "liam@gmail.com", phone: "555-0109", totalSpent: 2100, preferences: "High protein intake" },
        { name: "Olivia Wilde", email: "olivia@gmail.com", phone: "555-0110", totalSpent: 450, preferences: "Gluten free" },
        { name: "Noah Schnapp", email: "noah@gmail.com", phone: "555-0111", totalSpent: 120, preferences: "Kid friendly table" },
        { name: "Ava Max", email: "ava@gmail.com", phone: "555-0112", totalSpent: 540, preferences: "Fast service" },
        { name: "Ethan Hunt", email: "ethan@imf.org", phone: "555-0113", totalSpent: 3000, preferences: "Quiet corner" },
        { name: "Isabella Swan", email: "bella@gmail.com", phone: "555-0114", totalSpent: 75, preferences: "Sparkling water" },
        { name: "Lucas Scott", email: "lucas@gmail.com", phone: "555-0115", totalSpent: 210, preferences: "Basketball fan" }
    ],

    // 6. Inventory Items (40 records)
    inventory: [
        { name: "Potatoes", category: "Vegetables", quantity: 50, unit: "kg", reorderLevel: 10, supplier: "Fresh Farms", costPerUnit: 1.50 },
        { name: "Onions", category: "Vegetables", quantity: 30, unit: "kg", reorderLevel: 5, supplier: "Fresh Farms", costPerUnit: 1.20 },
        { name: "Tomatoes", category: "Vegetables", quantity: 20, unit: "kg", reorderLevel: 8, supplier: "Fresh Farms", costPerUnit: 2.00 },
        { name: "Chicken Breast", category: "Meat", quantity: 40, unit: "kg", reorderLevel: 10, supplier: "Meat Masters", costPerUnit: 8.00 },
        { name: "Beef Ribeye", category: "Meat", quantity: 25, unit: "kg", reorderLevel: 5, supplier: "Meat Masters", costPerUnit: 25.00 },
        { name: "Atlantic Salmon", category: "Seafood", quantity: 15, unit: "kg", reorderLevel: 3, supplier: "Sea Bounty", costPerUnit: 30.00 },
        { name: "Squid Rings", category: "Seafood", quantity: 10, unit: "kg", reorderLevel: 2, supplier: "Sea Bounty", costPerUnit: 15.00 },
        { name: "Milk", category: "Dairy", quantity: 50, unit: "L", reorderLevel: 10, supplier: "Daily Dairy", costPerUnit: 1.20 },
        { name: "Cheddar Cheese", category: "Dairy", quantity: 20, unit: "kg", reorderLevel: 5, supplier: "Daily Dairy", costPerUnit: 10.00 },
        { name: "Mozzarella", category: "Dairy", quantity: 15, unit: "kg", reorderLevel: 5, supplier: "Daily Dairy", costPerUnit: 12.00 },
        { name: "Butter", category: "Dairy", quantity: 10, unit: "kg", reorderLevel: 2, supplier: "Daily Dairy", costPerUnit: 9.00 },
        { name: "Penne Pasta", category: "Dry Goods", quantity: 30, unit: "kg", reorderLevel: 10, supplier: "Pantry Pros", costPerUnit: 2.50 },
        { name: "Arborio Rice", category: "Dry Goods", quantity: 20, unit: "kg", reorderLevel: 5, supplier: "Pantry Pros", costPerUnit: 4.00 },
        { name: "Flour", category: "Dry Goods", quantity: 100, unit: "kg", reorderLevel: 20, supplier: "Pantry Pros", costPerUnit: 0.80 },
        { name: "Sugar", category: "Dry Goods", quantity: 50, unit: "kg", reorderLevel: 10, supplier: "Pantry Pros", costPerUnit: 1.00 },
        { name: "Olive Oil", category: "Condiments", quantity: 24, unit: "L", reorderLevel: 6, supplier: "Global Spices", costPerUnit: 15.00 },
        { name: "Soy Sauce", category: "Condiments", quantity: 12, unit: "L", reorderLevel: 3, supplier: "Global Spices", costPerUnit: 5.00 },
        { name: "Black Pepper", category: "Spices", quantity: 5, unit: "kg", reorderLevel: 1, supplier: "Global Spices", costPerUnit: 20.00 },
        { name: "Sea Salt", category: "Spices", quantity: 10, unit: "kg", reorderLevel: 2, supplier: "Global Spices", costPerUnit: 2.00 },
        { name: "Coca Cola", category: "Beverages", quantity: 240, unit: "cans", reorderLevel: 48, supplier: "SoftDrink Co", costPerUnit: 0.50 },
        { name: "Sprite", category: "Beverages", quantity: 120, unit: "cans", reorderLevel: 24, supplier: "SoftDrink Co", costPerUnit: 0.50 },
        { name: "Still Water 500ml", category: "Beverages", quantity: 500, unit: "pcs", reorderLevel: 100, supplier: "AquaClear", costPerUnit: 0.20 },
        { name: "Sparkling Water 500ml", category: "Beverages", quantity: 200, unit: "pcs", reorderLevel: 50, supplier: "AquaClear", costPerUnit: 0.50 },
        { name: "Lemons", category: "Fruits", quantity: 100, unit: "pcs", reorderLevel: 20, supplier: "Fruit Stand", costPerUnit: 0.30 },
        { name: "Avocados", category: "Fruits", quantity: 30, unit: "pcs", reorderLevel: 10, supplier: "Fruit Stand", costPerUnit: 1.50 },
        { name: "Paper Napkins", category: "Supplies", quantity: 5000, unit: "pcs", reorderLevel: 500, supplier: "Supply Guys", costPerUnit: 0.01 },
        { name: "Takeaway Containers", category: "Supplies", quantity: 1000, unit: "pcs", reorderLevel: 200, supplier: "Supply Guys", costPerUnit: 0.15 },
        { name: "Plastic Straws", category: "Supplies", quantity: 2000, unit: "pcs", reorderLevel: 500, supplier: "Supply Guys", costPerUnit: 0.005 },
        { name: "Trash Bags", category: "Supplies", quantity: 500, unit: "pcs", reorderLevel: 100, supplier: "Supply Guys", costPerUnit: 0.10 },
        { name: "Egg Box (30)", category: "Dairy", quantity: 10, unit: "boxes", reorderLevel: 3, supplier: "Daily Dairy", costPerUnit: 5.00 },
        { name: "Heavy Cream", category: "Dairy", quantity: 20, unit: "L", reorderLevel: 5, supplier: "Daily Dairy", costPerUnit: 6.00 },
        { name: "Coffee Beans", category: "Dry Goods", quantity: 15, unit: "kg", reorderLevel: 5, supplier: "Bean Bliss", costPerUnit: 22.00 },
        { name: "Teabags (Black)", category: "Dry Goods", quantity: 500, unit: "pcs", reorderLevel: 100, supplier: "Bean Bliss", costPerUnit: 0.05 },
        { name: "Chocolate Chips", category: "Baking", quantity: 10, unit: "kg", reorderLevel: 2, supplier: "Bake World", costPerUnit: 11.00 },
        { name: "Yeast", category: "Baking", quantity: 5, unit: "kg", reorderLevel: 1, supplier: "Bake World", costPerUnit: 15.00 },
        { name: "Asparagus", category: "Vegetables", quantity: 10, unit: "kg", reorderLevel: 2, supplier: "Fresh Farms", costPerUnit: 7.00 },
        { name: "Mushrooms", category: "Vegetables", quantity: 15, unit: "kg", reorderLevel: 3, supplier: "Fresh Farms", costPerUnit: 6.00 },
        { name: "Lamb Chops (Raw)", category: "Meat", quantity: 12, unit: "kg", reorderLevel: 4, supplier: "Meat Masters", costPerUnit: 28.00 },
        { name: "Shrimp (U15)", category: "Seafood", quantity: 15, unit: "kg", reorderLevel: 5, supplier: "Sea Bounty", costPerUnit: 22.00 },
        { name: "Basil Leaves", category: "Herbs", quantity: 2, unit: "kg", reorderLevel: 0.5, supplier: "Fresh Farms", costPerUnit: 12.00 }
    ],

    // 7. Taxes & Discounts (6 records)
    taxes: [
        { name: "VAT", rate: 15, isActive: true },
        { name: "Service Charge", rate: 5, isActive: true },
        { name: "Municipality Tax", rate: 3, isActive: true }
    ],
    discounts: [
        { name: "HAPPYHOUR", type: "Percentage", value: 20, isActive: true },
        { name: "WELCOME50", type: "Fixed Amount", value: 50, isActive: true },
        { name: "STAFF30", type: "Percentage", value: 30, isActive: true }
    ]
};

module.exports = data;
