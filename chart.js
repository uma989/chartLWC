import { LightningElement, track,wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/chart';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import getChartInfo from '@salesforce/apex/AccountDropdown.getChartInfo';


import { CurrentPageReference } from 'lightning/navigation';
//const generateRandomNumber = () => { return Math.round(Math.random() * 100); };

    

export default class LibsChartjs extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track chosenValue;
    @track chartData;
    
     labelset = [];
     dataset = [];
  //  @track labelset = [];
    // @track dataset = [];
    
    @wire(CurrentPageReference) pageRef;
 
    connectedCallback() {
   
      registerListener("selectedOption", this.fetchChartData, this);
      }
   
    disconnectedCallback() {
      unregisterAllListeners(this);
    }
    fetchChartData(accountId)
    {
        this.chosenValue = accountId;
        //console.log('this.chosenValue==='+this.chosenValue);
        getChartInfo({'acId':this.chosenValue})
        .then(result => {
          //  console.log('result...'+result+' length is--'+result.length);
            this.chartData = JSON.parse(result);
            let i;
            let j;
       
          for(j=0; j< this.labelset.length; j++){
           
            this.labelset.splice(j);
            this.dataset.splice(j);
            
          }    
            for(i =0; i<this.chartData.length;i++)
            {
                  
               this.labelset.push(this.chartData[i].name);
                this.dataset.push(this.chartData[i].data);
               
            }
        
            this.chart.update();
           // console.log('Labels for graph..'+this.labelset);
            //console.log('integer for graph..'+this.dataset);
        })
   .catch(error=>{
       this.error = error;
   })
} 
   chart;
   chartjsInitialized = false;
   config = {
    type: 'doughnut',
    data: {
        datasets: [
            {
                data:this.dataset,
                   //[1,1,1,1,1],,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)'
                ],
                label: 'Dataset 1'
            }
        ],
        labels:this.labelset 
        //['Red', 'Orange', 'Yellow', 'Green', 'Blue']
    },
    options: {
        responsive: true,
        legend: {
            position: 'right'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }

};
    

renderedCallback() {
    if (this.chartjsInitialized) {
        return;
    }
    this.chartjsInitialized = true;

    loadScript(this, chartjs)
        .then(() => {
            const canvas = document.createElement('canvas');
            this.template.querySelector('div.chart').appendChild(canvas);
            const ctx = canvas.getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
        })
        .catch(error => {
            this.error = error;
        });
}
}
