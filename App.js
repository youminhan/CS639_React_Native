import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';
import { TextInput } from 'react-native';
import { Image } from 'react-native';
import Login from './Login';
import Signup from './Signup';
import Modal from './Modal';
import Button from './Button';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      showSingup: false,
      showModal: false,
      deleteResult: ""
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center'}}>
        <Text 
          style={{ color: "#C5050C", marginBottom: 20, fontWeight: 'bold', fontSize: 25}}
        >
          Welcome to UW-Fitness
        </Text>
        
       
        <View style={{flexDirection: 'row'}}>
          <Button  
            buttonStyle={{height: 40, width: 120, alignItems: 'center', backgroundColor: '#aaaaaa', marginRight: 3, justifyContent: 'space-between', padding: 10, borderRadius: 10}}
            textStyle={{color: "#4d4a43", fontSize: 15, fontWeight: 'bold'}}
            onPress={() => this.showSignup()}
            text={'New User'} 
          />
          <Button
            buttonStyle={{height: 40, width: 120, fontSize: 40, alignItems: 'center', backgroundColor: '#aaaaaa', marginLeft: 6, justifyContent: 'space-between', padding: 10, borderRadius: 10}}
            
            text={'Existing User'} 
            textStyle={{color: "#4d4a43", fontSize: 15, fontWeight: 'bold'}}
            onPress={() => this.showLogin()}
          />
        </View>
        

        <Image 
          style={{width: 250, height: 250,  resizeMode:'contain'}}
          source={require('./UWLogo.png')} 
        />
        <Login width={350} height={650} show={this.state.showLogin} hide={() => this.hideLogin()} delete= {(text) => this.updateFeedback(text)}/>
        <Signup width={350} height={650} show={this.state.showSignup} hide={() => this.hideSignup()}/>
        <Text>{this.state.deleteResult}</Text>
      </View>
    );
  }

  updateFeedback(result) {
    this.setState({deleteResult: result});
  }

  showLogin() {
    this.setState({showLogin: true});
  }

  hideLogin(){
    this.setState({showLogin: false});
  }

  showSignup() {
    this.setState({showSignup: true});
  }

  hideSignup(){
    this.setState({showSignup: false});
  }



}

export default App;





