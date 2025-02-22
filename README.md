# Spending Analysis
Spending Analysis is a tool designed to help individuals analyse their spending habits by creating custom reports.

You can define your own date ranges, select specific categories, sub-categories and accounts, and visualise your data through interactive charts.

Explore the app using the included demo transaction data, or download your own data from online banking and link the app to your local database.

### Demo Note:
Demo data is included to allow for testing and review of the application: ```banking-analytics-app/server/data/demoTransactions.json``` 

Running this app as described below will use the demo data.

Functionality to fetch data from a local MySQL database is commented out, for reference only.

## Technologies Used
### Front-end:
- **Vue.js**: JavaScript framework used for developing front-end of the application.
- **Vuex**: State management library for Vue, used to centrally store and manage application state.
- **Vuex PersistedState**: Vuex plugin that allows state to persist across page reloads by saving to session storage.
- **Vue Router**: Router for Vue, used for page navigation.
- **Axios**: JavaScript library for making HTTP requests, used to fetch data from back-end API.
- **Chart.js**: Charting library used to create interactive charts.
- **Vue-Chartjs**: Chart.js wrapper for integration with Vue components.
- **Day.js**: Javascript library for date formatting and manipulation.
- **Element Plus**: UI component library for Vue, for consistent styling and smooth user experience.

### Back-end
- **Express**: Node.js framework used to build back-end API.
- **CORS**: Cross-Origin Resource sharing, to allow requests from different domains (if linking to local database).
- **dotenv**: Allows loading of environment variables from a ```.env``` file, for secure storage of config variables (if linking to local database).
- **mysql2**: MySQL client for Node.js, used to interact with MySQL database for fetching transaction data (if linking to local database).

### Development Tools
- **Jest**: JavaScript testing framework for front-end unit testing.
- **Vue CLI**: Command-line interface for Vue, used to initiate and manage project with built-in configurations.
- **Sass**: CSS preprocessor for improved styling.
- **TypeScript**: Adds static typing to improve code quality.
- **ESLint**: Linting tool that assists development by enforcing code consistency and preventing errors.

## Installation Instructions
### Prerequisites
- **Node.js** Version 14 or higher
- **npm** 
- **MySQL** Version 5.7 or higher (if linking to local database)

### Step by step
**1. Clone the repository:**
```bash
git clone https://github.com/abryat/banking-analytics-app.git 

cd banking-analytics-app
```

**2. Install dependencies:**
```bash
npm install
```

**3. Run the application:**
```bash
npm run dev
```

**4. Access the application at:**
```
http://localhost:8080
```

## Usage Instructions
### 1. Home Page
- Click 'Get Started' to begin setting up your report

### 2. Setup Page
- Select a start and end date for your transaction analysis. This will filter the data you wish to analyse.
- Optionally, choose categories, subcategories and accounts. This will filter the transaction data to those selections. By default, all data are included.

### 3. View Analysis
- Once filters are set, click 'Analyse' to view the report. The report page includes charts to visualise your spending across the selected categories and date ranges.

## Testing
This project uses **Jest** for unit testing. Tests are currently available for the **front-end** application.
### Running unit tests
To run the front-end tests, execute this command in the ```banking-analytics-app``` folder:
```bash
npm run test-client
```
After running the tests, the results showing whether the tests have passed or failed will display in the terminal.

## API Endpoints
The server uses the following API endpoints:
- ```GET /api/demoTransactions```: Fetches mock demo transaction data.
- ```GET /api/transactions```: Fetches transaction data from a connected database (only available if linked to a MySQL database).

## Folder Structure
```plaintext
banking-analytics-app/
├── client/                     Front-end
│   ├── public/                 Static files: index.html, favicon.
│   ├── src/                    Source code for front-end.
│   │   ├── assets/             Static assets: images and stylesheet.
│   │   ├── components/         Vue components.
│   │   ├── store/              Vuex store config and state management.
│   │   ├── App.vue             Root Vue component containing main data API call.
│   │   ├── main.ts             Main entry point for Vue, sets up Vue instance.
│   │   ├── router.ts           Vue Router config for page navigation.
│   ├── tests/                  
│       └── unit/               Unit tests for front-end components.
│
└── server/                     Back-end
    └── data/                   Demo transaction data.
    └── server.js               Entry point for back-end (Express) and MySQL connection.
```
    
