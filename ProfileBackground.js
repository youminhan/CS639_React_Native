import React from 'react';
import { Text, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Button from './Button';
import Profile from './Profile';
class Modal extends React.Component {
  render() {
    if(this.props.show) {
      const screenWidth = Math.round(Dimensions.get('window').width);
      const screenHeight = Math.round(Dimensions.get('window').height);

      return (
        <View style={{position: 'absolute'}}>
         
          <View style={{position: 'absolute', backgroundColor: 'white', opacity:1, width: screenWidth, height: screenHeight}}>
            <Profile screenProps={{
              show: this.props.show,
              hide: this.props.hide, 
              delete: this.props.delete,
              intdata: this.props.intdata,
              data: this.props.data,
              username: this.props.username,
              password: this.props.password,
              accesscode: this.props.accesscode
            }}/>
          </View>
          
        </View>
      )
    }
    return (<View></View>)
  }
}

export default Modal;
