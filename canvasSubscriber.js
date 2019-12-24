import { LightningElement, track, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import getContactList from '@salesforce/apex/AccountDropdown.getContactList';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';


//import {ShowToastEvent} from 'lightning/platformShowToastEvent'
 
export default class CanvasSubscriber extends LightningElement {
 @track contacts;
 @track chosenValue= '';
 @track flag = true;
@track Id= '';
 
 @track chosenContact = '';
  @wire(CurrentPageReference) pageRef;
 
  connectedCallback() {
 
    registerListener("selectedOption", this.handleSelectedOption, this);
    //console.log('Subscriber....' + this.contacts);
   //  console.log('====='+JSON.stringify(this.contacts));
  }
 
  disconnectedCallback() {
    unregisterAllListeners(this);
  }
  handleSelectedOption(newValue) {
    const selectedOption = newValue;
 //console.log('selected value=' + selectedOption);
    this.chosenValue = selectedOption;
    //console.log('value in parent=='+this.chosenValue);
    getContactList({'accountId': this.chosenValue})
    .then(result => {
      this.contacts = result;
     // console.log('this.contacts'+this.contacts);
 })
 .catch(error=>{
     this.error = error;
 })
 }
 @track items1=[];
 @wire(getContactList)
 wiredContactList({ error, data }) {
  var i;
  if (data) {

      //create array with elements which has been retrieved controller
      //here value will be Id and label of combobox will be Name
      for(i=0; i<data.length; i++)  {
          this.items1 = [...this.items1 ,{value: data[i].Id , label: data[i].Name} ];                                   
      }             
      //console.log('check data'+JSON.stringify(this.items))   
      this.error = undefined;
  } else if (error) {
      this.error = error;
      this.accounts = undefined;
  }
}
 handleContactSelect(event) {
   //alert(1);
    // fire contactSelected event
   // alert( event.target.value);
    const contactSelected = event.target.value;
    
    this.chosenContact = contactSelected;
   // alert(event);
    fireEvent(this.pageRef, "contactSelected", this.chosenContact);
    fireEvent(this.pageRef, "contacts", this.contacts);
   // fireEvent(this.pageRef, 'contactSelected', event.target.contact.Id);
   // console.log(contactSelected);
    
}

}

