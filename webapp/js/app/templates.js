define(['text!templates/overlay.html',
    'text!templates/popup.html',
    'text!templates/popup_arrow.html',
    'text!templates/popup_simple.html',
    'text!templates/metodologia.html',
    'text!templates/tooltip.html',
    'text!templates/sql/click_feature.txt',
    'text!templates/sql/permalink.txt',
    'text!templates/sql/d3_geom.txt',
    'text!templates/sql/d3_proximity_query.txt'], 
    function(overlay, popup, popup_arrow, popup_simple, metodologia, tooltip,
             click_feature_sql, permalink_sql, 
             d3_geom_sql, d3_near_sql) {
        return {
            overlay: overlay,
            popup: popup,
            popup_arrow: popup_arrow,
            popup_simple: popup_simple,
            metodologia: metodologia,
            tooltip: tooltip,
            click_feature_sql: click_feature_sql,
            permalink_sql: permalink_sql,
            d3_geom_sql: d3_geom_sql,
            d3_near_sql: d3_near_sql
        };
});