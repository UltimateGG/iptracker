# IP Whitelist Tracker
Commerce Bank Project


# Tools & Links
Use the recommended IDEs and tools for this project and make sure they are up to date

- [IntelliJ IDEA](https://www.jetbrains.com/idea/) - For editing backend Java code
- [VS Code](https://code.visualstudio.com/) - For editing frontend ReactJS code
- [Postman](https://web.postman.co/) - HTTP/API testing tool. Create an account if you don't have one and get invited to the shared workspace


# Installation & Setup
1. Install **IntelliJ IDEA** (Ultimate Edition Preferrably) and **VS Code** from the links above if you don't have them already
2. Install or **update** [NodeJS](https://nodejs.org/en/) (**LTS Version**)
3. Install [Git](https://git-scm.com/downloads)
    - You may need to create a personal access token to authenticate with GitHub
    - In GitHub Settings > Developer Settings > Personal Access Tokens > Tokens (classic) > Generate New Token (Top right) > Classic
    - Enter a name and expiration date, for permissions you only need to select all under "repo"
    - Save the token, GitHub will not show it again
4. Clone the repository by running `git clone https://github.com/UltimateGG/iptracker.git` in your terminal
    - If prompted for authentication, use your username and for password **use the personal token made above**, NOT your GitHub password
5. Open the `Backend/` folder in IntelliJ IDEA
    - Setup the SDK: File > Project Structure > Project tab
    - SDK Dropdown > Add SDK > Download JDK > Set version to 17, Download
    - Click apply, wait for the SDK to fully install and index before launching
6. At the top right, make sure the `Main` profile is selected and click the green play button to run the backend
    - Make sure if prompted you Enable annotation processing
7. Open the `Frontend/` folder in VS Code
8. Open a new terminal in VS Code and run `npm install` to install all the dependencies
9. Run `npm run dev` to start the frontend development server
10. Your browser should open to the frontend


### Database Viewer
You can view the database by going to http://localhost:8080/h2-console in your browser. Make sure to set the JDBC URL to `jdbc:h2:file:~/iptracker`, then click connect (Use default username/password, you may have to click connect twice)


# Info

### Frontend
- ReactJS + TypeScript
- Vite (Modern/faster/better create-react-app alternative)

### Backend
- Java 17
- Spring Boot
- H2 Embedded (File) Database
- Maven (Build Tool / Dependency Management) I prefer Maven over Gradle because of the POM syntax
