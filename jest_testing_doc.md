
Setup Process for ts_jest:

1.
    install jest and all depenencies

        npm install --save-dev jest typescript ts-jest @types/jest

2.  
    create config file - needed for ts to work

        npx ts-jest config:init

3.
    add 
        "test": "jest" 

    under "scripts"  in package.json



4. 
    for frontend, added

    "compilerOptions": {
    "esModuleInterop": true
  },

  to tsconfig.json


-----To run tests-----

    npm test 
