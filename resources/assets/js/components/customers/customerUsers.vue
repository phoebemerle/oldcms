<template>
    <div class="details-form">
        <div class="details-form__body" >
            <div v-if="additionalCustomers.length > 0"  v-for="(additionalCustomer, index) in additionalCustomers">
                <div>
                    <label>Primary User:</label>
                    <input type="checkbox" v-model="additionalCustomer.attributes.PrimaryUser">
                </div>
                <div>
                    <label>Title:</label>
                    <select v-model="additionalCustomer.attributes.Title">
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
                    <input type="text" v-model="additionalCustomer.attributes.FirstName"/>
                </div>
                <div>
                    <label>Surname:</label>
                    <input type="text" v-model="additionalCustomer.attributes.Surname"/>
                </div>
                <div>
                    <label>Email:</label>
                    <input type="text" v-model="additionalCustomer.attributes.Email"/>
                </div>
                <div id="telephoneSection">
                    <div>
                        <label>Telephone Country:</label>
                        <select name="countryCode" v-model="additionalCustomer.attributes.TelephoneCountry">
                            <option data-countryCode="GB" value="+44" Selected>UK (+44)</option>
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
                        <input type="text" v-model="additionalCustomer.attributes.TelephoneArea"/>
                    </div>
                    <div>
                        <label>Telephone Number:</label>
                        <input type="text" v-model="additionalCustomer.attributes.Telephone"/>
                    </div>
                </div>
                <div>
                    <label>Job Title:</label>
                    <input type="text" v-model="additionalCustomer.attributes.job_title"/>
                </div>
                <a :href="'#!/customer/accounts/edit/'+additionalCustomer.id"><button @click="moveTab()"class="btn btn-info">View Profile</button></a>
                <button class="btn btn-primary" @click="updateAddUser(index)">Update User Info</button>
                <hr>
            </div>
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

        props:['customer', 'additional'],

        data() {
            return {
                additionalCustomers: this.additional,
            }
        },

        watch:{
            additional(){
                this.additionalCustomers = this.additional;
            }
        },

        methods: {
            updateAddUser(index){
                let data = http.createData(this.additionalCustomers[index]);

                customerStore.updateCustomer(data);

            },

            moveTab(){
                event.emit(event.names.MOVE_TAB, 'Customers', 'mainCustomerDetails');

            }
        }
    }
</script>

<style lang="scss">
    @import "~#/variables";

</style>