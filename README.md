# 📊 Sale Report Frontend

A responsive and fully functional **Sales Report Management** frontend built using **React.js**. This application is designed to work seamlessly with the Sale Report backend and allows **Admins** and **Employees** to manage sales, products, customers, and reports efficiently.

> 🔗 Backend Repository: [Sale_Report_Backend](https://github.com/Sid9879/Sale_Report)

## 🚀 Live Demo

https://sale-report-frontend.vercel.app/

## 📌 Features

### 🔐 Authentication
- Login/Register functionality
- Role-based access control (Admin / Employee)

### 🧑‍💼 Admin Capabilities
- Manage Employees (Add/Edit/Delete)
- Add/Edit/Delete Products
- View full sales reports
- Filter reports by date, employee, and customer
- Monitor stock levels and product performance

### 🧾 Employee Capabilities
- Add new sales entries
- Auto-calculate total price
- Sell products from database stock
- View personal sales history

### 📈 Reports & Dashboard
- Real-time sales statistics
- Filtering, sorting, and searching
- Monthly and daily report insights

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| React.js   | Frontend library |
| Tailwind CSS | Utility-first CSS framework |
| Axios      | HTTP requests |
| React Router DOM | Routing and navigation |
| Redux | State management|

---

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
