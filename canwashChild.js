import { LightningElement,wire,track } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import getContactdetails from '@salesforce/apex/contactDetails.getContactdetails';
import { CurrentPageReference } from 'lightning/navigation';
export default class CanwashChild extends LightningElement {
    @track condetails;
 
 @track flag = true;
  @wire(CurrentPageReference) pageRef;
  connectedCallback() {
 
    registerListener("contactSelected", this.handleSelectedContact, this);
    //console.log('Subscriber....' + this.contacts);
     //console.log('====='+JSON.stringify(this.contacts1));
  }
 
  disconnectedCallback() {
    unregisterAllListeners(this);
  }
 
  handleSelectedContact(selcontact) {

    // Get the string of the "value" attribute on the selected option
  //  console.log('selected value=');
    //const selectedOption = event.detail.value;
    const contactSelected = selcontact;
 //console.log('selected value=' + selectedcontact);
    this.chosencontact = contactSelected;
   // console.log('value in parent=='+this.chosencontact);
    getContactdetails({'contactId': this.chosencontact})
    .then(result => {
      this.condetails = result;
      //console.log('this.contacts'+this.contacts1);
 })
 .catch(error=>{
     this.error = error;
 })
 } 

}