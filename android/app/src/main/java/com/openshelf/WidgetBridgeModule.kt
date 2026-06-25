package com.openshelf

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.openshelf.widget.OpenShelfWidgetProvider

class WidgetBridgeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "WidgetBridge"

  @ReactMethod
  fun updateStreakWidget(streakCount: Int, todayLogged: Boolean) {
    val prefs =
      reactContext.getSharedPreferences(OpenShelfWidgetProvider.PREFS_NAME, android.content.Context.MODE_PRIVATE)
    prefs.edit()
      .putInt(OpenShelfWidgetProvider.PREF_STREAK_COUNT, streakCount)
      .putBoolean(OpenShelfWidgetProvider.PREF_TODAY_LOGGED, todayLogged)
      .apply()

    OpenShelfWidgetProvider.refreshAllWidgets(reactContext)
  }
}
