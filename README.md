# Installation

 - Install latest version of node 18.16+
 - Ensure that you have `npm`
 - Run `npm install`
 - Run `npm start`

  Runs the app in the development mode.
  Open [http://localhost:4200](http://localhost:4200) to view it in your browser



#Required Configuration
- Configure NetLinx Processor Connection src > assets > configuration > controller.json
- Configure buttons src > app > dashboard > dashboard > dashboard.components.ts > btnGridConfig
- Configure levels  src > app > dashboard > dashboard > dashboard.components.ts > volumeControlConfig
- Configure Background Color src > app > services > theme.service.ts - Updated line 16, and 17 to appropriate CSS class.

##Notes
- The preset/Square buttons will display 8 buttons per page, and a next/previous button will be visible if greater than 8 buttons
- The Volume controls will display 2 per page, and a next/previous button with display if greater than 2.
