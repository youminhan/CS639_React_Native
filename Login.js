import React from 'react';
import {Alert, Text,TextInput, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Button from './Button';
import base64 from 'base-64';
import ProfileBackground from './ProfileBackground';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      userProfile: {},
      accesscode: "",
      errorMessage: "",
      showProfile: false
    }
  }
  

  handleUsername(text) {
    this.setState({username: text})
  }

  handlePassword(text) {
    this.setState({password: text})
  }
  
  

  async logIn() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", "");
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));
    
    
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow', 
    };

    try {
      let response = await fetch('https://mysqlcs639.cs.wisc.edu/login', requestOptions);
      let reponse = await response.json();
      
      if (!('message' in reponse)) {
        this.setState({showProfile: true})
      } else {
        Alert.alert("OOPS!", reponse.message);
      }
      this.setState({accesscode: JSON.parse(JSON.stringify(reponse.token))});
      myHeaders.set("x-access-token", reponse.token);
      requestOptions.headers = myHeaders;
      this.setState({errorMessage: reponse.message});
    } catch(err) {
      this.setState({errorMessage: "Incorrect username and/or password"});
    }
    try {
      let response2 = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, requestOptions)
      let reponse2 = await response2.json();
      this.setState({userProfile: reponse2});
    } catch(err) {
      this.setState({errorMessage: "Incorrect username and/or password"});
    }

    
  }
  showProfile() {
    this.setState({showProfile: true});
  }

  hideProfile(){
    this.setState({username: "", password: "", showProfile: false});
  }

  async deleteProfile(){
    var myDeleteHeaders = new Headers();
    myDeleteHeaders.append("Content-Type", "application/json");
    myDeleteHeaders.append("x-access-token", this.state.accesscode);
    
    var deleteOptions = {
      method: 'DELETE',
      headers: myDeleteHeaders,
      redirect: 'follow', 
    };
    try {
      let deleteResponse = await fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, deleteOptions)
      let deleteMessage = await deleteResponse.json();
      this.setState({errorMessage: deleteMessage.message});
    } catch(err) {
      this.setState({errorMessage: "Cannot Delete User"});
    }
    this.setState({username: "",
    password: "",
    userProfile: {},
    accesscode: "",
    errorMessage: "",
    showProfile: false,});
    Alert.alert("Thank you for joining us!!!", this.state.errorMessage);
  }

  render() {
    if(this.props.show) {
      const screenWidth = Math.round(Dimensions.get('window').width);
      const screenHeight = Math.round(Dimensions.get('window').height);

      return (
        <View style={{position: 'absolute'}}>
        <TouchableWithoutFeedback onPress={() => this.props.hide()}>
            <View style={{width: screenWidth, height: screenHeight, backgroundColor: 'black', opacity: 0.55}}>
            </View>
        </TouchableWithoutFeedback>
            <View style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width)/2, top: (screenHeight - this.props.height)/2, backgroundColor: '#9fa393', borderRadius: 10}}>
            <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Welcome Back!</Text>
            <Button buttonStyle={{alignItems: 'center', justifyContent: 'center', width: 70, height: 70, position: 'absolute', right: 0}} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
            <View style={{flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Enter your Username and Password</Text>
                <TextInput 
                  style={{paddingHorizontal: 5, height: 40, width: 140, borderColor: 'black', borderWidth: 2, marginTop: 20, marginBottom: 15, borderRadius: 5}}
                  placeholder="Username" 
                  placeholderColor="#c4c3cb" 
                  onChangeText={(text) => {this.handleUsername(text)}}
                />
                <TextInput 
                  style={{paddingHorizontal: 5, height: 40, width: 140, borderColor: 'black', borderWidth: 2, marginBottom: 15, borderRadius: 5}}
                  placeholder="Password" 
                  placeholderColor="#c4c3cb" 
                  secureTextEntry={true}
                  onChangeText={(text) => {this.handlePassword(text)}}
                />
                <Button
                  buttonStyle={{height: 40, width: 120, fontSize: 40, alignItems: 'center', backgroundColor: '#aaaaaa', marginTop: 14, marginLeft: 6, justifyContent: 'center', borderRadius: 10}}
                  text={'Login'} 
                  textStyle={{color: "#4d4a43", fontSize: 19, fontWeight: 'bold'}}
                  onPress={() => this.logIn()}
                /> 
                {/* <Text style={{fontSize: 20, textAlign:'center', alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 20, marginTop: 15, color: "red"}}>{this.state.errorMessage}</Text>
                <Text style={{fontSize: 20, textAlign:'center', alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 20, marginTop: 15, color: "red"}}>{this.state.showProfile}</Text>
          */}
            </View>
          </View>
          {/* <ModifyProfile  intdata = {this.state.userProfile.goalDailyCalories} data={this.state.userProfile} username={this.state.username} accesscode = {this.state.accesscode} width={350} height={650} hide={() => {this.hideProfile(); this.props.hide();}}  show={this.state.showProfile}/> */}
          <ProfileBackground 
            hide={() => {this.hideProfile(); this.props.hide();}} 
            delete={() => {this.deleteProfile(); this.props.hide();}} 
            show={this.state.showProfile}
            intdata = {this.state.userProfile.goalDailyCalories}
            data={this.state.userProfile}
            username={this.state.username}
            password={this.state.password}
            accesscode = {this.state.accesscode} 
          />
        </View>

      )
    }
    return (<View></View>)
  }
}

export default Modal;
