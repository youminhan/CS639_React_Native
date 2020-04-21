import React from 'react';
import {Alert, Text,TextInput, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Button from './Button';
import base64 from 'base-64';


class Logactivity extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      userProfile: {},
      errorMessage: "",
      value: this.props.intdata,
      newdata: JSON.parse(JSON.stringify(this.props.data)),
      errorMessage: ""
    }
  }
  
  handleFirstname(text) {
    let curr = this.state.newdata;
    curr.firstName = text;
    this.setState({newdata: curr});
  }

  handleLastname(text) {
    let curr = this.state.newdata;
    curr.lastName = text;
    this.setState({newdata: curr});
  }

  handleCalories(text) {
    let curr = this.state.newdata;
    curr.goalDailyCalories = text;
    this.setState({newdata: curr});
  }

  handleActivity(text) {
    let curr = this.state.newdata;
    curr.goalDailyActivity = text;
    this.setState({newdata: curr});
  }

  handleFat(text) {
    let curr = this.state.newdata;
    curr.goalDailyFat = text;
    this.setState({newdata: curr});
  }

  handleProtein(text) {
    let curr = this.state.newdata;
    curr.goalDailyProtein = text;
    this.setState({newdata: curr});
  }

  handlePassword(text) {
    let curr = this.state.newdata;
    curr.password = text;
    this.setState({newdata: curr});
  }

  handleCarbonhydrates(text) {
    let curr = this.state.newdata;
    curr.goalDailyCarbohydrates = text;
    this.setState({newdata: curr});
  }
  

  submitChange() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", this.props.accesscode);
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));
    
    
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(this.state.newdata),
      redirect: 'follow', 
    };

    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.props.username, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.setState({errorMessage: result.message});
        if (result.message.includes("updated")) {
          Alert.alert("Congratulations!!!", result.message)
        } else {
          Alert.alert("OOPS!", result.message)
        }
      })
        .catch(error => this.setState({errorMessage: "hellosdasd"}));
    
    
  }
  render() {
    
      const screenWidth = Math.round(Dimensions.get('window').width);
      const screenHeight = Math.round(Dimensions.get('window').height);

     

      return (
        <View style={{position: 'absolute'}}>
        
            <View style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width)/2, backgroundColor: '#9fa393'}}>
            <View style={{flex: 1}}>
                <Text style={{marginLeft: 20, marginRight: 20,fontSize: 25,textAlign:'center', marginBottom: 40, alignItems: 'center', fontWeight: 'bold'}}>View and change your current name and goals</Text>

                <View style={{flexDirection: 'row', marginLeft: 25}}>
                  <Text style={{color: "purple", fontSize: 20, width: 230, fontWeight: 'bold'}}>Password: </Text>
                  <TextInput 
                    style={{color: '#be03fc',fontWeight: 'bold', height: 30, width: 100,textAlign:'center', alignItems: 'center', borderColor: 'purple', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    defaultValue= {`${this.props.data.password}`}
                    placeholderTextColor="#be03fc" 
                    textStyle={{marginLeft: 2}}
                    secureTextEntry={true}
                    onChangeText={(text) => {this.handlePassword(text)}}
                  />
                </View>
               
               
                <View style={{flexDirection: 'row', marginLeft: 25}}>
                  <Text style={{color: "purple", fontSize: 20, width: 230, fontWeight: 'bold'}}>First Name : </Text>
                  <TextInput 
                    
                    style={{ color: '#be03fc',fontWeight: 'bold', height: 30, width: 100,textAlign:'center', alignItems: 'center', borderColor: 'purple', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    defaultValue= {this.props.data.firstName}
                    placeholderTextColor="#000000" 
                    onChangeText={(text) => {this.handleFirstname(text)}}
                  />
                </View>

                <View style={{flexDirection: 'row', marginLeft: 25}}>
                  <Text style={{color: "purple", fontSize: 20, width: 230, fontWeight: 'bold'}}>Last Name : </Text>
                  <TextInput 
                    
                    style={{color: '#be03fc',fontWeight: 'bold', height: 30, width: 100,textAlign:'center', alignItems: 'center', borderColor: 'purple', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    defaultValue= {this.props.data.lastName}
                    placeholderTextColor="#000000" 
                    onChangeText={(text) => {this.handleLastname(text)}}
                  />
                </View>

                <View style={{flexDirection: 'row', marginLeft: 25}}>
                  <Text style={{color: "purple", fontSize: 20, width: 230, fontWeight: 'bold'}}>Activity Goal: </Text>
                  <TextInput 
                    style={{color: '#be03fc',fontWeight: 'bold', height: 30, width: 100,textAlign:'center', alignItems: 'center', borderColor: 'purple', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    defaultValue= {`${this.props.data.goalDailyActivity}`}
                    placeholderTextColor="#be03fc" 
                    textStyle={{marginLeft: 2}}
                    onChangeText={(text) => {this.handleActivity(text)}}
                  />
                </View>

                <View style={{flexDirection: 'row', marginLeft: 25}}>
                  <Text style={{color: "purple", fontSize: 20, width: 230, fontWeight: 'bold'}}>Calories Goal: </Text>
                  <TextInput 
                    style={{color: '#be03fc',fontWeight: 'bold', height: 30, width: 100,textAlign:'center', alignItems: 'center', borderColor: 'purple', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    defaultValue= {`${this.props.data.goalDailyCalories}`}
                    placeholderTextColor="#be03fc" 
                    textStyle={{marginLeft: 2}}
                    onChangeText={(text) => {this.handleCalories(text)}}
                  />
                </View>


                <View style={{flexDirection: 'row', marginLeft: 25}}>
                  <Text style={{color: "purple", fontSize: 20, width: 230, fontWeight: 'bold'}}>Carbohydrates Goal: </Text>
                  <TextInput 
                    style={{color: '#be03fc',fontWeight: 'bold', height: 30, width: 100,textAlign:'center', alignItems: 'center', borderColor: 'purple', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    defaultValue= {`${this.props.data.goalDailyCarbohydrates}`}
                    placeholderTextColor="#be03fc" 
                    textStyle={{marginLeft: 2}}
                    onChangeText={(text) => {this.handleCarbonhydrates(text)}}
                  />
                </View>

                <View style={{flexDirection: 'row', marginLeft: 25}}>
                  <Text style={{color: "purple", fontSize: 20, width: 230, fontWeight: 'bold'}}>Fat Goal: </Text>
                  <TextInput 
                    style={{color: '#be03fc',fontWeight: 'bold', height: 30, width: 100,textAlign:'center', alignItems: 'center', borderColor: 'purple', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    defaultValue= {`${this.props.data.goalDailyFat}`}
                    placeholderTextColor="#be03fc" 
                    textStyle={{marginLeft: 2}}
                    onChangeText={(text) => {this.handleFat(text)}}
                  />
                </View>

                <View style={{flexDirection: 'row', marginLeft: 25}}>
                  <Text style={{color: "purple", fontSize: 20, width: 230, fontWeight: 'bold'}}>Protein Goal: </Text>
                  <TextInput 
                    style={{color: '#be03fc',fontWeight: 'bold', height: 30, width: 100,textAlign:'center', alignItems: 'center', borderColor: 'purple', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                    defaultValue= {`${this.props.data.goalDailyProtein}`}
                    placeholderTextColor="#be03fc" 
                    textStyle={{marginLeft: 2}}
                    onChangeText={(text) => {this.handleProtein(text)}}
                  />
                </View>
                 <Text style={{fontSize: 20, textAlign:'center', alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 20, marginTop: 15, color: "purple"}}>*All Goals are in daily measurment</Text>

               
                <View style={{flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                <Button
                  buttonStyle={{height: 40, display: 'flex', width: 160, fontSize: 40, alignItems: 'center', justifyContent: 'center' ,backgroundColor: '#aaaaaa', marginTop: 14, marginLeft: 6, justifyContent: 'center', borderRadius: 10}}
                  text={'Submit Changes'} 
                  textStyle={{color: "#4d4a43", fontSize: 19, fontWeight: 'bold'}}
                  onPress={() => this.submitChange()}
                /> 
                </View>
                
            </View>
           
          </View>
        </View>
      )
    
    
  }
}

export default Logactivity;