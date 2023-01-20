# Reaktor pre-assignment 2023
Assignment can be found here: [Birdnest](https://assignments.reaktor.com/birdnest/?_gl=1*l2c1yq*_ga*MTE1MTY1MzY0My4xNjcwODU3NTE0*_ga_DX023XT0SX*MTY3Mzc3NjQ3Ny41LjEuMTY3Mzc3NjYwMy4zOS4wLjA.)

##### Running app locally
1. Clone to your local computer
2. Run
```
npm install
```
inside app's root dir and inside frontend

3. Build frontend
```
REACT_APP_BACKEND_URL=http:localhost:BACKEND_PORT npm run build
```
(default BACKEND_PORT=3001)

4. Copy dir build to app's root dir
```
cp -r build/ ./../
```

5. Inside root dir, run backend with (default port 3001)
```
PORT=PORT_NUM npm run dev
or
PORT=PORT_NUM npm start
```

App is running [here](https://misty-night-2499.fly.dev/)

It takes couple of seconds for app to start fetching data.
