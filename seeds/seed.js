const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const Customer = require("../models/Customer");
const StockMovement = require("../models/StockMovement");

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Inventory.deleteMany();
    await Customer.deleteMany();
    await StockMovement.deleteMany();

    // Create users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@orderflow.com",
      password: "password123",
      role: "admin",
    });

    const sales = await User.create({
      name: "Sales Executive",
      email: "sales@orderflow.com",
      password: "password123",
      role: "sales",
    });

    const warehouse = await User.create({
      name: "Warehouse Manager",
      email: "warehouse@orderflow.com",
      password: "password123",
      role: "warehouse",
    });

    const viewer = await User.create({
      name: "Viewer User",
      email: "viewer@orderflow.com",
      password: "password123",
      role: "viewer",
    });

    console.log("Users created");

    // Create products
    const products = await Product.insertMany([
      { name: "Laptop Dell XPS 15", sku: "LAP-DELL-001", category: "Electronics", unitPrice: 1299.99, reorderLevel: 10, description: "Dell XPS 15 laptop", createdBy: admin._id },
      { name: "Wireless Mouse Logitech", sku: "MOU-LOG-001", category: "Accessories", unitPrice: 29.99, reorderLevel: 50, description: "Logitech wireless mouse", createdBy: admin._id },
      { name: "USB-C Hub 7-in-1", sku: "HUB-USB-001", category: "Accessories", unitPrice: 49.99, reorderLevel: 25, description: "7-in-1 USB-C hub adapter", createdBy: admin._id },
      { name: "Monitor Samsung 27\"", sku: "MON-SAM-001", category: "Electronics", unitPrice: 349.99, reorderLevel: 15, description: "Samsung 27 inch monitor", createdBy: admin._id },
      { name: "Mechanical Keyboard", sku: "KEY-MEC-001", category: "Accessories", unitPrice: 89.99, reorderLevel: 30, description: "RGB mechanical keyboard", createdBy: admin._id },
      { name: "Webcam HD 1080p", sku: "CAM-HD-001", category: "Electronics", unitPrice: 69.99, reorderLevel: 20, description: "HD 1080p webcam", createdBy: admin._id },
      { name: "Ethernet Cable Cat6 3m", sku: "CAB-ETH-001", category: "Cables", unitPrice: 9.99, reorderLevel: 100, description: "Cat6 ethernet cable 3 meters", createdBy: admin._id },
      { name: "Laptop Stand Aluminium", sku: "STD-LAP-001", category: "Accessories", unitPrice: 39.99, reorderLevel: 20, description: "Aluminium laptop stand", createdBy: admin._id },
    ]);

    console.log("Products created");

    // Create inventory records
    const stockLevels = [120, 200, 80, 45, 8, 60, 500, 30];
    for (let i = 0; i < products.length; i++) {
      await Inventory.create({
        product: products[i]._id,
        warehouse: "Main Warehouse",
        totalStock: stockLevels[i],
        reservedStock: 0,
      });

      await StockMovement.create({
        product: products[i]._id,
        warehouse: "Main Warehouse",
        type: "INITIAL",
        quantity: stockLevels[i],
        reason: "Initial stock on seed",
        performedBy: admin._id,
      });
    }

    console.log("Inventory created");

    // Create customers
    await Customer.insertMany([
      { name: "TechCorp Inc.", email: "orders@techcorp.com", phone: "555-0101", address: "123 Tech Street", city: "San Francisco", createdBy: sales._id },
      { name: "Office Solutions Ltd", email: "buy@officesolutions.com", phone: "555-0102", address: "456 Business Ave", city: "New York", createdBy: sales._id },
      { name: "StartupHub", email: "procurement@startuphub.com", phone: "555-0103", address: "789 Innovation Blvd", city: "Austin", createdBy: sales._id },
      { name: "EduTech Academy", email: "supplies@edutech.edu", phone: "555-0104", address: "321 Campus Dr", city: "Boston", createdBy: sales._id },
    ]);

    console.log("Customers created");

    console.log("\n=== Seed Complete ===");
    console.log("Admin:     admin@orderflow.com / password123");
    console.log("Sales:     sales@orderflow.com / password123");
    console.log("Warehouse: warehouse@orderflow.com / password123");
    console.log("Viewer:    viewer@orderflow.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDB();
