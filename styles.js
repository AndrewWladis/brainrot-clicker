import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainButton: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#ff00ff',
    shadowColor: '#ff00ff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  brainText: {
    fontSize: 80,
    color: '#fff',
  },
  pointsContainer: {
    position: 'absolute',
    top: 100,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 70,
    fontWeight: '900',
    color: '#ff00ff',
    fontFamily: 'monospace',
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  flavorText: {
    position: 'absolute',
    bottom: 100,
    fontSize: 16,
    color: '#00ff00',
    fontFamily: 'monospace',
    textAlign: 'center',
    padding: 10,
  },
});

export default styles;