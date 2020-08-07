## Croma (https://croma.app)

[![Croma DEMO](https://img.youtube.com/vi/KqrsdAuvW40/0.jpg)](https://www.youtube.com/watch?v=KqrsdAuvW40)

![](Croma_web.gif)

# referances

- https://github.com/numixproject/croma
- https://github.com/satya164/croma
- https://github.com/satya164/pigment

### Building web version

`expo web:build`
This will generate web-build directory. Relative path does not work with this so you have to host it in the root.

# Expo commands

`expo start -w` for starting the web version.
`expo start -w --no-dev` for production version.

### Android

Run locally:

`npm run android`

Build signed apk:
`cd android`
`./release.sh`

Ref: https://reactnative.dev/docs/signed-apk-android

Bundle

`./bundle-android.sh`

### Code styling

https://github.com/google/google-java-format

https://github.com/sherter/google-java-format-gradle-plugin

https://github.com/typicode/husky

Fix java files

```

./gradlew goJF

```

### [Browse react native vector icons](https://oblador.github.io/react-native-vector-icons/)
