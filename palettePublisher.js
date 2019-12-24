import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getAccountList from '@salesforce/apex/AccountDropdown.getAccountList';
import { fireEvent } from 'c/pubsub';
 
export default class PalletePublisher extends LightningElement {
   // @track color;
   @track items = []; //this will hold key, value pair
   @track value = ''; //initialize combo box value

   @track chosenValue = '';
   sVal = '';
   i=0;
 
  @wire(CurrentPageReference) pageRef;
/*  updateaccount(event) {
    this.sVal = event.target.value;
} */
@wire(getAccountList)
wiredAccountList({ error, data }) {
    var i;
    if (data) {

        //create array with elements which has been retrieved controller
        //here value will be Id and label of combobox will be Name
        for(i=0; i<data.length; i++)  {
            this.items = [...this.items ,{value: data[i].Id , label: data[i].Name} ];                                   
        }             
        //console.log('check data'+JSON.stringify(this.items))   
        this.error = undefined;
    } else if (error) {
        this.error = error;
        this.accounts = undefined;
    }
}
 
 /* handleSearchKeyChange(searchKey) {
    this.searchKey = searchKey;
  } */
  get accountOptions() {
    //console.log('1')
    return this.items;
}
/*handleSelectedKeyChange(selectedOption) {
    this.selectedOption = selectedOption;
  } */
  handleChange(event) {
    // Get the string of the "value" attribute on the selected option
  //  console.log('selected value=');
    const selectedOption = event.detail.value;
    //alert(event);
 //console.log('selected value=' + selectedOption);
    this.chosenValue = selectedOption;
    fireEvent(this.pageRef, "selectedOption", this.chosenValue);
    //console.log(selectedOption);
}
}