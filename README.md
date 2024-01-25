

# Web Interface for ABB Ventilation Controller

## Project Overview
This repository contains the source code for a web-based interface designed to interact with the ABB Ventilation Controller simulator. It allows users to display information and issue commands to control ventilation systems in either automatic or manual modes.

## Key Features
- **Two Operating Modes**: Users can toggle between Automatic and Manual modes via the web interface.
- **Real-Time Interaction**: The interface dynamically displays changes and allows real-time control of the ventilation simulator.
- **User Authentication**: Secure login to access the web interface.

## Technology Stack
- **Front-end**: HTML, CSS, EJS, and JavaScript for building the user interface.
- **Back-end**: Node.js for server-side logic and handling HTTP requests.
- **Simulator**: Python scripts (`controller.py` and `VSS.py`) simulate the ventilation control system.

## Getting Started
### Prerequisites
- Node.js installed on your system.
- Python for running the simulator scripts.
- Basic knowledge of running Python and Node.js applications.

### Installation and Setup
1. **Clone the Repository**: 
   ```
   git clone https://github.com/Siddhartha1986/Web-Interface-for-ABB-Ventilation-Controller.git
   ```
2. **Install Dependencies**:
   Navigate to the project directory and run:
   ```
   npm install
   ```
3. **Run the Simulators**:
   Execute `controller.py` and `VSS.py` to start the ventilation controller and Web-UI simulators.

### Running the Application
1. **Start the Server**:
   In the project directory, run:
   ```
   node server.js
   ```
   The server will start on `localhost:4000`.
2. **Access the Web Interface**:
   Open your web browser and navigate to `http://localhost:4000`.
3. **Login**:
   Use the credentials `sidd@gmail.com` and password `12345` to log in.

## Usage
- After logging in, you can view the status and control the ventilation simulator through the web interface.
- Toggle between Automatic and Manual modes to interact with the simulator.
- Adjust settings like pressure or fan speed and observe the changes in the simulators.

## Additional Resources
- [User Manual](https://github.com/Siddhartha1986/Web-Interface-for-ABB-Ventilation-Controller/blob/main/user_manual.pdf): Detailed guide on how to use the web interface.

## Contributing
We welcome contributions to this project. Please feel free to fork the repository, make your changes, and submit a pull request.

