package app.croma;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.numixproject.colorextractor.image.Color;
import org.numixproject.colorextractor.image.Image;
import org.numixproject.colorextractor.image.KMeansColorPicker;

import java.util.ArrayList;
import java.util.List;

public class CromaModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int PICK_COLORS = 1;
    private final ReactApplicationContext reactContext;
    private Callback callback;
    public CromaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "CromaModule";
    }

    @ReactMethod
    public void navigateToColorPicker(Callback callback) {
        this.callback = callback;
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, ColorPickerActivity.class);
        context.startActivityForResult(intent, PICK_COLORS, new Bundle());
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (data != null && requestCode == PICK_COLORS) {
            try {
                this.callback.invoke(mapToJsonString(data.getIntegerArrayListExtra("colors")));
            } catch (JSONException e) {
                throw new IllegalStateException(e);
            }
        }
    }

    private String mapToJsonString(List<Integer> colors) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        List<JSONObject> colorsObjs = new ArrayList<>();
        for (int color : colors) {
            colorsObjs.add(new JSONObject().put("color", String.format("#%06X", (0xFFFFFF & color)).toLowerCase()));
        }
        jsonObject.put("colors", new JSONArray(colorsObjs));
        return jsonObject.toString();
    }

    @Override
    public void onNewIntent(Intent intent) {

    }


    @ReactMethod
    public void pickTopColorsFromImage(String uri, Callback callback) {
        try {
            Uri imageUri = Uri.parse(uri);
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(reactContext.getContentResolver(), imageUri);
            Image image = new BitmapImage(bitmap);
            KMeansColorPicker k = new KMeansColorPicker();
            List<Color> colors = k.getUsefulColors(image, 6);
            List<Integer> intColors = new ArrayList<>();
            for (Color color : colors) {
                intColors.add(color.getRGB());
            }
            callback.invoke(null, mapToJsonString(intColors));
        } catch (Exception e) {
            e.printStackTrace();
            callback.invoke(e);
        }
    }
    private static class BitmapImage extends Image {
        private Bitmap image;

        public BitmapImage(Bitmap b) {
            super(b.getWidth(), b.getHeight());
            this.image = b;
        }
        @Override
        public Color getColor(int x, int y) {
            return new Color(image.getPixel(x, y));
        }

        @Override
        public BitmapImage getScaledInstance(int width, int height) {
            Bitmap resized = Bitmap.createScaledBitmap(this.image, width, height, true);

            return new BitmapImage(resized);
        }
    }
}