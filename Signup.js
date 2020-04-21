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
  
  

  logIn() {
    let obj = {};
    obj.username = this.state.username;
    obj.password = this.state.password;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", "");
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow'
    };


    let myHeaders2 = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-access-token", "");
    myHeaders.append("Authorization", 'Basic ' + base64.encode(this.state.username + ":" + this.state.password));
    
    
    
    let requestOptions2 = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow', 
    };

    fetch('https://mysqlcs639.cs.wisc.edu/users', requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.message.includes("created")) {
          Alert.alert("Congratulations!!!", result.message);
          fetch('https://mysqlcs639.cs.wisc.edu/login', requestOptions2)
            .then(response2 => response2.json())
            .then(result2 => {
              this.setState({showProfile: true});
              this.setState({accesscode: JSON.parse(JSON.stringify(result2.token))});
              myHeaders2.set("x-access-token", result2.token);
              requestOptions2.headers = myHeaders2;
              this.setState({errorMessage: result2.message});
              fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, requestOptions2)
                .then(response3 => response3.json())
                .then(result3 => {
                  this.setState({userProfile: result3});
                })
            })
        } else {
          Alert.alert("OOPS!", result.message)
        }
      })
      .catch(error => this.setState({errorMessage: error.text()}));
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

      let profilepage;
      if (this.state.showProfile) {
        profilepage = <ProfileBackground 
          hide={() => {this.hideProfile(); this.props.hide();}} 
          delete={() => {this.deleteProfile(); this.props.hide();}} 
          show={this.state.showProfile}
          data={this.state.userProfile}
          username={this.state.username}
          password={this.state.password}
          accesscode = {this.state.accesscode} 
        />;
      } else {
        profilepage = <View></View>;
      }
      
      return (
        <View style={{position: 'absolute'}}>
        <TouchableWithoutFeedback onPress={() => this.props.hide()}>
            <View style={{width: screenWidth, height: screenHeight, backgroundColor: 'black', opacity: 0.55}}>
            </View>
        </TouchableWithoutFeedback>
          <View style={{position: 'absolute', width: this.props.width, height: this.props.height, left: (screenWidth - this.props.width)/2, top: (screenHeight - this.props.height)/2, backgroundColor: '#9fa393', borderRadius: 10}}>
            <Text style={{fontSize: 25, marginLeft: 20, marginTop: 15}}>Ready to start?</Text>
            <Button buttonStyle={{alignItems: 'center', justifyContent: 'center', width: 70, height: 70, position: 'absolute', right: 0}} textStyle={{fontSize: 25}} text={'✕'} onPress={() => this.props.hide()}/>
            <View style={{flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Create with Username and Password</Text>
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
                  buttonStyle={{height: 40, width: 120, fontSize: 40, alignSelf: 'center',alignItems: 'center', backgroundColor: '#aaaaaa', marginTop: 14, marginLeft: 6, justifyContent: 'center', borderRadius: 10}}
                  text={'Sign Up'} 
                  textStyle={{color: "#4d4a43", fontSize: 19, fontWeight: 'bold'}}
                  onPress={() => this.logIn()}
                />
                
            </View>
          </View>
          {profilepage}
        </View>

      )
    }
    return (<View></View>)
  }
}

export default Modal;