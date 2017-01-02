/**
 * Created by Sven on 02.01.2017.
 */
var navdata;
var count = 0;

function loadJSON(file) {
    fr = new FileReader();
    fr.onload = function (e) {
        lines = e.target.result;
        navdata = (JSON.parse(lines))[0].data;
        count = 0;
        console.log(navdata);
    };

    fr.readAsText(file);
}

function getNextDataSet(){
    dataSet = navdata[count];
    count++;
    
    navdataSet = new Navdata(
        dataSet.roll != undefined ? dataSet.roll : null,
        dataSet.pitch != undefined ? dataSet.pitch : null,
        dataSet.yaw != undefined ? dataSet.yaw : null,
        dataSet.thrust != undefined ? dataSet.thrust : null,
        dataSet.depth != undefined ? dataSet.depth : null,
        dataSet.heading != undefined ? dataSet.heading : null,
        dataSet.acclx != undefined ? dataSet.acclx : null,
        dataSet.accly != undefined ? dataSet.accly : null,
        dataSet.acclz != undefined ? dataSet.acclz : null,
        dataSet.magx != undefined ? dataSet.magx : null,
        dataSet.magy != undefined ? dataSet.magy : null,
        dataSet.magz != undefined ? dataSet.magz : null,
        dataSet.gyrox != undefined ? dataSet.gyrox : null,
        dataSet.gyroy != undefined ? dataSet.gyroy : null,
        dataSet.gyroz != undefined ? dataSet.gyroz : null,
        dataSet.lacclx != undefined ? dataSet.lacclx : null,
        dataSet.laccly != undefined ? dataSet.laccly : null,
        dataSet.lacclz != undefined ? dataSet.lacclz : null,
        dataSet.gravx != undefined ? dataSet.gravx : null,
        dataSet.gravy != undefined ? dataSet.gravy : null,
        dataSet.gravz != undefined ? dataSet.gravz : null,
        dataSet.timestamp != undefined ? dataSet.timestamp : null
    )

    console.log("data set " + count + ": " + navdataSet);
    return navdataSet;
}