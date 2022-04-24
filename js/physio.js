/** Class used to manage physiological data 
 * @class
*/

var Physio = function() {
    this.buffer = [];
    //channels 2,16,3,17

    // Set up filter 
    sampleRate = 250
    lowFreq = 7
    highFreq = 30
    filterOrder = 128
    firCalculator = new Fili.FirCoeffs();
    coeffs = firCalculator.bandpass({order: filterOrder, Fs: sampleRate, F1: lowFreq, F2: highFreq});
    filter = new Fili.FirFilter(coeffs);


    channels = {}
    window.psd = {}
    window.bands = {}
    tempSeriesData = {}
    isChannelDataReady = {2: false, 16:false, 3: false, 17: false}
    this.SECONDS = 4;

    window.channelSampleCount = {}
    this.BUFFER_SIZE = this.SECONDS * 256;
    this.isConnected = false
  
    this.addData = (sample, channel) => {
        if (!channels[channel]) {
            channels[channel] = []
            //isChannelDataReady[channel] = false
            window.channelSampleCount[channel] = 0
        }   

        // Add all samples to current array
        for (i in sample) {
            if (channels[channel].length > this.BUFFER_SIZE - 1) {
                channels[channel].shift();
            }
            
            channels[channel].push(sample[i]);
            window.channelSampleCount[channel] = window.channelSampleCount[channel] + 1

            //var data = { TP9: sample[i] };
            //window.rawSignalGraph.series.addData(data);
            //window.rawSignalGraph.render()
            
        }

        tempSeriesData[channel] = sample
        isChannelDataReady[channel] = true
    };
  
    this.getLenght = () => {
      return this.buffer.length;
    };
  
    this.getBuffer = () => {
      return this.buffer;
    };

    
    psdToPlotPSD = function(psd, max){
        //console.log(psdToPlotPSD)
        out = []
        for (i in psd) {
            //console.log(psd[i])
            out.push({x: parseInt(i), y:psd[i]})
            if (i > max){
                return out
            }
            
        }        
    }


  
    var getBandPower = (channel, band) => {
      if(!channels[channel]) return 0

      if (channels[channel].length < this.BUFFER_SIZE) {
        return 0;
      }
  
      signal = filter.simulate(channels[channel])
      let psd = window.bci.signal.getPSD(
        this.BUFFER_SIZE,
        channels[channel]
      );

      psd.shift()
      window.psd[channel] = psd
      
      let bp = window.bci.signal.getBandPower(
        this.BUFFER_SIZE,
        psd,
        256,
        band
      );

      return bp;
    };
  
    var getRelativeBandPower = (channel, band) => {
      var target = getBandPower(channel, band);
      var delta = getBandPower(channel, "delta");
      var theta = getBandPower(channel, "theta");
      var alpha = getBandPower(channel, "alpha");
      var beta = getBandPower(channel, "beta");
      var gamma = getBandPower(channel, "beta");
      return target / (delta + theta + alpha + beta + gamma);
    };

    var checkForVisualizationRefresh = function() {
        //console.log(isChannelDataReady)
        if (isChannelDataReady[2] && isChannelDataReady[3] && isChannelDataReady[16] && isChannelDataReady[17]){
            //console.log("All True!")
            isChannelDataReady[2] = false
            isChannelDataReady[3] = false 
            isChannelDataReady[16] = false
            isChannelDataReady[17] = false

            // hard coded. fix later to support various EEG devices
            for (i in tempSeriesData[2]){
                var data = { TP9: tempSeriesData[2][i], TP10: tempSeriesData[3][i]+ 300, AF8: tempSeriesData[17][i] + 600 , AF7: tempSeriesData[16][i] + 900};
                //console.log(data)
                window.rawSignalGraph.series.addData(data);
                window.rawSignalGraph.render();
            }

            // flush old data
            for (i in tempSeriesData) {
                tempSeriesData[i] = []
            }

            // tp9
            delta = getRelativeBandPower(2, "delta")
            theta = getRelativeBandPower(2, "theta")
            alpha = getRelativeBandPower(2, "alpha")
            beta =  getRelativeBandPower(2, "beta")
            gamma = getRelativeBandPower(2, "gamma")
            totalPower = delta + theta + alpha + beta + gamma
            window.bands["tp9"] = {delta, theta, alpha, beta, gamma, totalPower}
            var tp9Data = [ { x: 0, y: theta }, { x: 1, y: alpha }, { x: 2, y: beta }, { x: 3, y: gamma }]
            window.bpGraph.series[0].data = tp9Data

            // tp10
            delta = getRelativeBandPower(3, "delta")
            theta = getRelativeBandPower(3, "theta")
            alpha = getRelativeBandPower(3, "alpha")
            beta = getRelativeBandPower(3, "beta")
            gamma = getRelativeBandPower(3, "gamma")
            totalPower = delta + theta + alpha + beta + gamma
            window.bands["tp10"] = {delta, theta, alpha, beta, gamma, totalPower}
            var tp10Data =  [ { x: 0, y: theta }, { x: 1, y: alpha }, { x: 2, y: beta }, { x: 3, y: gamma }]
            window.bpGraph.series[1].data = tp10Data;
            
            // AF8
            delta = getRelativeBandPower(17, "delta")
            theta = getRelativeBandPower(17, "theta")
            alpha = getRelativeBandPower(17, "alpha")
            beta = getRelativeBandPower(17, "beta")
            gamma = getRelativeBandPower(17, "gamma")
            totalPower = delta + theta + alpha + beta + gamma
            window.bands["af8"] = {delta, theta, alpha, beta, gamma, totalPower}
            var af8Data =  [ { x: 0, y: theta }, { x: 1, y: alpha }, { x: 2, y: beta }, { x: 3, y: gamma }]
            window.bpGraph.series[2].data = af8Data;

            // AF7
            delta = getRelativeBandPower(16, "delta")
            theta = getRelativeBandPower(16, "theta")
            alpha = getRelativeBandPower(16, "alpha")
            beta = getRelativeBandPower(16, "beta")
            gamma = getRelativeBandPower(16, "gamma")
            totalPower = delta + theta + alpha + beta + gamma
            window.bands["af7"] = {delta, theta, alpha, beta, gamma, totalPower}
            var af7Data =  [ { x: 0, y: theta }, { x: 1, y: alpha }, { x: 2, y: beta }, { x: 3, y: gamma }]
            window.bpGraph.series[3].data = af7Data;
            window.bpGraph.update();

            // Update PSD graph
            if (window.psd[2] && window.psd[3]){
            
                //tp9
                psdPlotData = psdToPlotPSD(window.psd[2],120)
                window.psdGraph.series[0].data = psdPlotData
               
                //tp10
                psdPlotData = psdToPlotPSD(window.psd[3],120)
                window.psdGraph.series[1].data = psdPlotData
                window.psdGraph.update();

                //af7
                psdPlotData = psdToPlotPSD(window.psd[16],120)
                window.psdGraph.series[2].data = psdPlotData
                window.psdGraph.update();

                //af8
                psdPlotData = psdToPlotPSD(window.psd[17],120)
                window.psdGraph.series[3].data = psdPlotData
                window.psdGraph.update();
            }
        }
    }
  
    this.device = new Blue.BCIDevice(sample => {
        let { electrode, data } = sample;
        this.addData(data, electrode)
        checkForVisualizationRefresh()

        

    });
  
    this.start = () => {
      this.device.connect();
    };
  
    return this;
  };

  $("#bluetooth").click((e) => {
      var physio = new Physio()
      physio.start()
  })