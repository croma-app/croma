## Croma (https://croma.app)

![](Croma_web.gif)

# referances
* https://github.com/numixproject/croma
* https://github.com/satya164/croma
* https://github.com/satya164/pigment


### Building web version
``` expo web:build ```
This will generate web-build directory. Relative path does not work with this so you have to host it in the root. 


# Expo commands
``` expo start -w ``` for starting the web version.
``` expo start -w --no-dev ``` for production version. 

### Prettier
```  prettier --write "**/*.js" ```


### Android
Run locally:

``` npm run android ```

Build signed apk:

```  ./gradlew clean && ./gradlew :app:bundleRelease ```

Ref: https://reactnative.dev/docs/signed-apk-android 

Bundle

``` react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/ ```