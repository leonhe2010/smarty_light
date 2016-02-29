define(function (require) {
    var echarts = require('echarts');
    echarts.config = require('echarts/config');
    require('echarts/chart/line');
    require('echarts/chart/pie');
    require('echarts/chart/bar');
    require('echarts/chart/map');
    require('echarts/chart/tree');
    return echarts;
});