// https://stackoverflow.com/questions/8059184/make-an-arrow-using-css
const styles = {
  arrow: {
    width: 0,
    borderColor: '#d9534f',
    borderStyle: 'solid',
    borderWidth: 30,
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
};

export default () => <div style={styles.arrow} />;
