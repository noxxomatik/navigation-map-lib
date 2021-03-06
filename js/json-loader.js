/**
 * Loader for downloaded OpenROV telemetry data.
 * @author Sven Otte
 * @module json-loader
 */

/**
 * Loader for downloaded OpenROV telemetry data.
 * @constructor
 */
function JSONLoader() {
    var navdata;
    var count;
    var length;

    /**
     * Loads a JSON-file.
     * @param {File} file - The JSON-file.
     */
    this.loadJSON = function(file) {
        fr = new FileReader();
        fr.onload = function (e) {
            lines = e.target.result;
            navdata = (JSON.parse(lines))[0].data;
            length = navdata.length;
            count = 0;
            console.log(navdata);
        };

        fr.readAsText(file);
    };

    /**
     * Returns the next set of navdata.
     * @returns {Navdata}
     */
    this.getNextDataSet = function() {
        // check if end of object is reached
        if (count == length) {
            return null;
        }

        dataSet = navdata[count];
        count++;

        navdataSet = new Navdata(
            dataSet.roll != undefined ? dataSet.roll : null,
            dataSet.pitch != undefined ? dataSet.pitch : null,
            dataSet.yaw != undefined ? dataSet.yaw : null,
            dataSet.thrust != undefined ? dataSet.thrust : null,
            dataSet.deapth != undefined ? dataSet.deapth : null,
            dataSet.hdgd != undefined ? dataSet.hdgd : null,
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
        );

        console.log("JSONLoader received data set " + count);
        return navdataSet;
    }
}
