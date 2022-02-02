<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div id="accountNumberSection"  class="sections">
                <h2>Account Number</h2>
                <div>
                    <label>Account Number:</label>
                    <p>{{primeCustomer.attributes.AccountNumber}}</p>
                </div>
            </div>

             <div id="accountNumberSection"  class="sections">
                <h2>Trade Account</h2>
                <div>
                    <label>Trade Account:</label>
                      <input type="checkbox" v-model="primeCustomer.attributes.trade_pricing">
                </div>
            </div>

            <div id="userInfo"  class="sections">
                <h2>User Info</h2>
                <div>
                    <label>Company:</label>
                    <input type="text" v-model="primeCustomer.attributes.Company"/>
                </div>
                <div>
                    <label>Job Title:</label>
                    <input type="text" v-model="primeCustomer.attributes.job_title"/>
                </div>
                <div id="nameSection">
                    <div>
                        <label>Title:</label>
                        <select v-model="primeCustomer.attributes.Title">
                            <option value="Mr.">Mr.</option>
                            <option value="Sir.">Sir.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Ms.">Ms.</option>
                            <option value="Miss.">Miss.</option>
                            <option value="Dr.">Dr.</option>
                            <option value="Mx.">Mx.</option>
                        </select>
                    </div>
                    <div>
                        <label>First Name:</label>
                        <input type="text" v-model="primeCustomer.attributes.FirstName"/>
                    </div>
                    <div>
                        <label>Surname:</label>
                        <input type="text" v-model="primeCustomer.attributes.Surname"/>
                    </div>
                </div>

            </div>

            <div id="userContactSection" class="sections">
                <h2>Contact Info</h2>
                <div>
                    <label>Contact Name:</label>
                    <input type="text" v-model="contactName"/>
                </div>
                <div>
                    <label>Email:</label>
                    <input type="text" v-model="primeCustomer.attributes.Email"/>
                </div>
                <div id="telephoneSection">
                    <div>
                        <label>Telephone Country:</label>
                        <select name="countryCode" v-model="primeCustomer.attributes.TelephoneCountry">
                            <option data-countryCode="GB" value="+44">UK (+44)</option>
                            <optgroup label="Other countries">
                                <option data-countryCode="BE" value="+32">Belgium (+32)</option>
                                <option data-countryCode="BG" value="+359">Bulgaria (+359)</option>
                                <option data-countryCode="CA" value="+1">Canada (+1)</option>
                                <option data-countryCode="HR" value="+385">Croatia (+385)</option>
                                <option data-countryCode="CY" value="+90392">Cyprus North (+90392)</option>
                                <option data-countryCode="CY" value="+357">Cyprus South (+357)</option>
                                <option data-countryCode="CZ" value="+42">Czech Republic (+42)</option>
                                <option data-countryCode="DK" value="+45">Denmark (+45)</option>
                                <option data-countryCode="EG" value="+20">Egypt (+20)</option>
                                <option data-countryCode="EE" value="+372">Estonia (+372)</option>
                                <option data-countryCode="FI" value="+358">Finland (+358)</option>
                                <option data-countryCode="FR" value="+33">France (+33)</option>
                                <option data-countryCode="DE" value="+49">Germany (+49)</option>
                                <option data-countryCode="GI" value="+350">Gibraltar (+350)</option>
                                <option data-countryCode="GR" value="+30">Greece (+30)</option>
                                <option data-countryCode="GL" value="+299">Greenland (+299)</option>
                                <option data-countryCode="HU" value="+36">Hungary (+36)</option>
                                <option data-countryCode="IS" value="+354">Iceland (+354)</option>
                                <option data-countryCode="IE" value="+353">Ireland (+353)</option>
                                <option data-countryCode="IT" value="+39">Italy (+39)</option>
                                <option data-countryCode="LV" value="+371">Latvia (+371)</option>
                                <option data-countryCode="LI" value="+417">Liechtenstein (+417)</option>
                                <option data-countryCode="LT" value="+370">Lithuania (+370)</option>
                                <option data-countryCode="LU" value="+352">Luxembourg (+352)</option>
                                <option data-countryCode="MT" value="+356">Malta (+356)</option>
                                <option data-countryCode="MX" value="+52">Mexico (+52)</option>
                                <option data-countryCode="MC" value="+377">Monaco (+377)</option>
                                <option data-countryCode="MA" value="+212">Morocco (+212)</option>
                                <option data-countryCode="NL" value="+31">Netherlands (+31)</option>
                                <option data-countryCode="NZ" value="+64">New Zealand (+64)</option>
                                <option data-countryCode="NF" value="+672">Norfolk Islands (+672)</option>
                                <option data-countryCode="NO" value="+47">Norway (+47)</option>
                                <option data-countryCode="PY" value="+595">Paraguay (+595)</option>
                                <option data-countryCode="PL" value="+48">Poland (+48)</option>
                                <option data-countryCode="PT" value="+351">Portugal (+351)</option>
                                <option data-countryCode="RO" value="+40">Romania (+40)</option>
                                <option data-countryCode="RU" value="+7">Russia (+7)</option>
                                <option data-countryCode="CS" value="+381">Serbia (+381)</option>
                                <option data-countryCode="SK" value="+421">Slovak Republic (+421)</option>
                                <option data-countryCode="SI" value="+386">Slovenia (+386)</option>
                                <option data-countryCode="ES" value="+34">Spain (+34)</option>
                                <option data-countryCode="SE" value="+46">Sweden (+46)</option>
                                <option data-countryCode="CH" value="+41">Switzerland (+41)</option>
                                <option data-countryCode="TN" value="+216">Tunisia (+216)</option>
                                <option data-countryCode="TR" value="+90">Turkey (+90)</option>
                                <option data-countryCode="UA" value="+380">Ukraine (+380)</option>
                                <option data-countryCode="US" value="+1">USA (+1)</option>
                                <option data-countryCode="AE" value="+971">United Arab Emirates (+971)</option>
                                <option data-countryCode="UY" value="+598">Uruguay (+598)</option>
                                <option data-countryCode="VA" value="+379">Vatican City (+379)</option>
                                <option data-countryCode="VG" value="+84">Virgin Islands - British (+1284)</option>
                                <option data-countryCode="VI" value="+84">Virgin Islands - US (+1340)</option>
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <label>Telephone Area:</label>
                        <input type="text" v-model="primeCustomer.attributes.TelephoneArea"/>
                    </div>
                    <div>
                        <label>Telephone Number:</label>
                        <input type="text" v-model="primeCustomer.attributes.Telephone"/>
                    </div>
                </div>
                <div>
                    <p>Full Number:  {{primeCustomer.attributes.TelephoneCountry + primeCustomer.attributes.TelephoneArea + primeCustomer.attributes.Telephone}}</p>
                </div>
                <div>
                    <label>Mobile Number:</label>
                    <input type="text" v-model="primeCustomer.attributes.TelephoneMobile"/>
                </div>
                <div>
                    <label>Fax:</label>
                    <input type="text" v-model="primeCustomer.attributes.Fax"/>
                </div>
            </div>
            <button class="btn btn-primary" @click="saveCustomer()">Update</button>
        </div>
    </div>
</template>

<script>
    import {event} from '@/services';
    import {sharedStore} from '@/stores';
    import {customerStore} from '@/stores';
    import {http} from "@/services";
    import customerStub from '@/stubs/Customers';


    export default {

        props:['customer', 'tab', 'subview'],

        data() {
            return {
                primeCustomer: customerStub,
            }
        },

        computed: {
            contactName: {
        // getter
        get: function () {
          return this.primeCustomer.attributes.Surname ? this.primeCustomer.attributes.FirstName + ' ' + this.primeCustomer.attributes.Surname : this.primeCustomer.attributes.FirstName
        },
        // setter
        set: function (newValue) {
          if (newValue.indexOf(' ') !== -1) {
              var names = newValue.split(' ')
              this.primeCustomer.attributes.FirstName = names[0]
              this.primeCustomer.attributes.Surname = names[1] ? names[1] : ''
          } else {
              this.primeCustomer.attributes.FirstName = newValue
          }
        }
      }
    },

        watch:{
            customer(){
                if(this.customer) {
                    if (this.customer.type === 'customer-details') {
                        this.primeCustomer.attributes.trade_pricing = this.customer.attributes.customerinformation.trade_pricing;
                        this.primeCustomer = this.customer;
                    }
                }
            }
        },

        methods: {
            saveCustomer(){
                let data = http.createData(this.primeCustomer);

                customerStore.updateCustomer(data);

            },
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

    .sections{
        border-radius: 0.5rem;
        border: 0.1rem solid #c9c9c9;
        padding:10px;

        h2{
            text-decoration: underline;
        }
    }
    label, input{
        display:inline-block;
        max-width:unset !important;
    }

    #accountNumberSection{
        width:100%;
    }

    #nameSection, #telephoneSection {
        width:100%;
        div{
            width:30%;
            display:inline-block;
        }
    }

</style>