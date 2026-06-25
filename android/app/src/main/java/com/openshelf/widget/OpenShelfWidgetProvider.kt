package com.openshelf.widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import com.openshelf.R

class OpenShelfWidgetProvider : AppWidgetProvider() {

  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (appWidgetId in appWidgetIds) {
      updateAppWidget(context, appWidgetManager, appWidgetId)
    }
  }

  companion object {
    const val PREFS_NAME = "openshelf_widget"
    const val PREF_STREAK_COUNT = "streak_count"
    const val PREF_TODAY_LOGGED = "today_logged"

    fun updateAppWidget(
      context: Context,
      appWidgetManager: AppWidgetManager,
      appWidgetId: Int,
    ) {
      val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      val streakCount = prefs.getInt(PREF_STREAK_COUNT, 0)
      val todayLogged = prefs.getBoolean(PREF_TODAY_LOGGED, false)

      val views = RemoteViews(context.packageName, R.layout.widget_openshelf)
      views.setTextViewText(R.id.widget_streak_count, streakCount.toString())
      views.setTextViewText(
        R.id.widget_status,
        if (todayLogged) "Streak secured today ✓" else "Log activity today!",
      )
      views.setTextViewText(R.id.widget_flame, if (streakCount > 0) "🔥" else "📚")

      appWidgetManager.updateAppWidget(appWidgetId, views)
    }

    fun refreshAllWidgets(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      val component = android.content.ComponentName(context, OpenShelfWidgetProvider::class.java)
      val ids = manager.getAppWidgetIds(component)
      onUpdateStatic(context, manager, ids)
    }

    private fun onUpdateStatic(
      context: Context,
      appWidgetManager: AppWidgetManager,
      appWidgetIds: IntArray,
    ) {
      for (appWidgetId in appWidgetIds) {
        updateAppWidget(context, appWidgetManager, appWidgetId)
      }
    }
  }
}
