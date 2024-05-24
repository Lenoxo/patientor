# Patientor frontend

This app showcases a list of patients, allowing to create patients and for each patient, add entries according to several types of patient entries.

## Demo video:

### Getting started

- To get the app running follow these steps:
  1. Install its dependencies with `npm install`.
  2. Clone and start the backend of this project with
  ```bash
  git clone https://github.com/Lenoxo/patientor-back.git
  cd patientor-back
  # install dependencies, transpile the TS project to JS within ./build and run the server with node
  npm i && npm run tsc && npm run start
  ```
  3. Update the `apiBaseUrl` variable in `constants.ts` to match the backend exposed API with port (Only if you changed the port in the backend).
  4. and run the fronted development server with `npm run dev`.

### Technologies used

- React + Typescript, with Material UI library for UI components and icons.
