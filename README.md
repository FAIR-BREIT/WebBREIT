#### Web GUI for BREIT (Balance Rate Equations for Ion Transportation)

Web GUI for the [BREIT (Balance Rate Equations for Ion Transportation)](https://github.com/FAIR-BREIT/BREIT-CORE) project.

Requirements: [node.js](https://nodejs.org/).

Steps to run:

```bash
git clone https://github.com/FAIR-BREIT/WebBREIT.git WebBREIT
cd WebBREIT
npm install
BREIT_BINARY_DIR=/path/to/BREIT/bin/ npm start
```

The `BREIT_BINARY_DIR` environment variable points to the location of the BREIT scripts and executables.

By default the app can be accessed at [http://localhost:3000](http://localhost:3000).
