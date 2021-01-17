# SkillSTAR

## Overview
Mobile application teaching essential skills to young children afflicted by autism. A collaboration between UVa and UMich.  Built by Sartography.

## Getting Started

### Setting up the project:
1. In the terminal, from SkillStar home directory, type: `npm install`
2. Then, in the terminal, type  `npm run start`
3. Once running, `the Metro Bundler` should pop up in a web-browser tab.


### Running the app from your computer:
In order to demo locally:
1. Install the Android SDK [Android SDK](https://developer.android.com/studio) _and/or_ the [XCode Simulator](https://developer.apple.com/documentation/xcode/running_your_app_in_the_simulator_or_on_a_device) on your computer,
2. Start the [**Android Emulator**](https://developer.android.com/studio/run/emulator) or [**iOS Simulator**](https://developer.apple.com/documentation/xcode/running_your_app_in_the_simulator_or_on_a_device), on your computer,
3. Back in the **"Metro Bundler"** browser-tab, select `"Run on Android device"` or `"Run on iOS Simulator"`
4. Within the emulator or simulator, will display the Expo app installing, and then bundling and running the SkillSTAR app.
5. You're good to go!


### Running the app from a mobile device:
1. In order to demo the app from a mobile device, download the `Expo Client` app onto the mobile device. (Find the Expo app here: [iOS](https://apps.apple.com/us/app/expo-client/id982107779)  / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)),
2. Once the `Expo Client` is installed on the device, open the `Metro Bundler` in your browser,
3. From `Expo Client` on your device, select the "Projects" tab and then tap `"Scan QR Code"`.
4. Aim device at the QR Code in the Metro Bundler,
5. Voila!  The SkillSTAR app will bundle and run.

### Font loading issues
If you see a bunch of error messages about 'anticon' or 'material' fonts not loading, you'll need to run the following commands at the project root:
```bash
rm -rf node_modules
rm -rf package-lock.json
rm -rf .expo
npm install
expo install
expo start -c
```

### Un-ejecting expo
If you eject the from the managed Expo project and want to undo it, just revert any changes to `package.json` to the pre-ejected version, then run these commands:
```bash
rm -rf android
rm -rf ios
rm -rf node_modules
rm -rf package-lock.json
rm -rf .expo
npm install
expo install
expo start -c
```
