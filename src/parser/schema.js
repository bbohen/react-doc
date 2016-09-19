// (Eventual) schema that the parser will output
// Import these to centralize changes to here

const PARAM = {
  type: '',
  name: '',
  description: ''
};

const METHOD = {
  name: '',
  description: '',
  params: [
    PARAM
  ],
  returns: PARAM
};

const FILE = {
  name: '', // file.js
  path: '', // path/to/file.js
  react: false,
  stateless: false,
  propTypes: [
    PARAM
  ],
  lifecycleMethods: [
    METHOD
  ],
  localStatePARAMs: [
    PARAM
  ]
};

const result = {
  components: [
    FILE
  ],
  containers: [
    FILE
  ],
  other: [
    FILE
  ]
};

export default result;
