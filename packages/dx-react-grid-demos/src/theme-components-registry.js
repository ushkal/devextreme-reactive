/* eslint-disable quote-props */
/* eslint-disable global-require */
/* eslint-disable no-template-curly-in-string */

module.exports.themeComponents = {
  "bootstrap3": {
    "boolean-type-provider": {
      "boolean-type-provider.jsx": "\"import * as React from 'react';\\nimport { DataTypeProvider } from '@devexpress/dx-react-grid';\\n\\nconst Formatter = ({ value }) => (value ? 'Yes' : 'No');\\n\\nexport const BooleanTypeProvider = props => (\\n  <DataTypeProvider\\n    formatterComponent={Formatter}\\n    {...props}\\n  />\\n);\\n\""
    },
    "currency-type-provider": {
      "currency-type-provider.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\nimport { DataTypeProvider } from '@devexpress/dx-react-grid';\\n\\nconst getInputValue = value => (value === undefined ? '' : value);\\n\\nconst Editor = ({ value, onValueChange }) => {\\n  const handleChange = (event) => {\\n    const { value: targetValue } = event.target;\\n    if (targetValue.trim() === '') {\\n      onValueChange();\\n      return;\\n    }\\n    onValueChange(parseInt(targetValue, 10));\\n  };\\n  return (\\n    <input\\n      type=\\\"number\\\"\\n      className=\\\"form-control text-right\\\"\\n      placeholder=\\\"Filter...\\\"\\n      value={getInputValue(value)}\\n      min={0}\\n      onChange={handleChange}\\n    />\\n  );\\n};\\n\\nEditor.propTypes = {\\n  value: PropTypes.number,\\n  onValueChange: PropTypes.func.isRequired,\\n};\\n\\nEditor.defaultProps = {\\n  value: undefined,\\n};\\n\\nconst Formatter = ({ value }) => `$${value}`;\\n\\nconst availableFilterOperations = [\\n  'equal', 'notEqual',\\n  'greaterThan', 'greaterThanOrEqual',\\n  'lessThan', 'lessThanOrEqual',\\n];\\n\\nexport const CurrencyTypeProvider = props => (\\n  <DataTypeProvider\\n    formatterComponent={Formatter}\\n    editorComponent={Editor}\\n    availableFilterOperations={availableFilterOperations}\\n    {...props}\\n  />\\n);\\n\""
    },
    "highlighted-cell": {
      "highlighted-cell.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\n\\nconst getColor = (amount) => {\\n  if (amount < 3000) {\\n    return '#fc7a76';\\n  }\\n  if (amount < 5000) {\\n    return '#ffb294';\\n  }\\n  if (amount < 8000) {\\n    return '#ffd59f';\\n  }\\n  return '#c3e2b7';\\n};\\n\\nexport const HighlightedCell = ({\\n  tableColumn, value, children, style,\\n}) => (\\n  <td\\n    style={{\\n      backgroundColor: getColor(value),\\n      textAlign: tableColumn.align,\\n      ...style,\\n    }}\\n  >\\n    {children}\\n  </td>\\n);\\n\\nHighlightedCell.propTypes = {\\n  value: PropTypes.number.isRequired,\\n  tableColumn: PropTypes.object,\\n  style: PropTypes.object,\\n  children: PropTypes.node,\\n};\\nHighlightedCell.defaultProps = {\\n  style: {},\\n  tableColumn: {},\\n  children: undefined,\\n};\\n\""
    },
    "loading": {
      "loading.css": "\".loading-shading {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  width: 100%;\\n  height: 100%;\\n\\n  background: rgba(255, 255, 255, .3);\\n}\\n\\n.loading-icon {\\n  position: absolute;\\n  font-size: 20px;\\n  top: calc(45% - 10px);\\n  left: calc(50% - 10px);\\n\\n  -animation: spin .7s infinite linear;\\n  -webkit-animation: spin2 .7s infinite linear;\\n}\\n\\n@-webkit-keyframes spin2 {\\n  from { -webkit-transform: rotate(0deg); }\\n  to { -webkit-transform: rotate(360deg); }\\n}\\n\\n@keyframes spin {\\n  from { transform: scale(1) rotate(0deg); }\\n  to { transform: scale(1) rotate(360deg); }\\n}\\n\"",
      "loading.jsx": "\"import * as React from 'react';\\nimport './loading.css';\\nimport { some } from './some-local-deps';\\n\\nexport const Loading = () => (\\n  <div className=\\\"loading-shading\\\">\\n    <span className=\\\"glyphicon glyphicon-refresh loading-icon\\\" />\\n  </div>\\n);\\n\""
    },
    "percent-type-provider": {
      "percent-type-provider.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\nimport { DataTypeProvider } from '@devexpress/dx-react-grid';\\n\\nconst getInputValue = value => (value === undefined ? '' : (value * 100).toFixed(1));\\n\\nconst Formatter = ({ value }) => `${getInputValue(value)}%`;\\n\\nconst Editor = ({ value, onValueChange }) => {\\n  const handleChange = (event) => {\\n    const { value: targetValue } = event.target;\\n    if (targetValue === '') {\\n      onValueChange();\\n      return;\\n    }\\n    onValueChange(Math.min(Math.max(parseFloat(targetValue / 100), 0), 1));\\n  };\\n  return (\\n    <input\\n      type=\\\"number\\\"\\n      className=\\\"form-control text-right\\\"\\n      placeholder=\\\"Filter...\\\"\\n      value={getInputValue(value)}\\n      step={0.1}\\n      min={0}\\n      max={100}\\n      onChange={handleChange}\\n    />\\n  );\\n};\\n\\nEditor.propTypes = {\\n  value: PropTypes.number,\\n  onValueChange: PropTypes.func.isRequired,\\n};\\n\\nEditor.defaultProps = {\\n  value: undefined,\\n};\\n\\nconst availableFilterOperations = [\\n  'equal', 'notEqual',\\n  'greaterThan', 'greaterThanOrEqual',\\n  'lessThan', 'lessThanOrEqual',\\n];\\n\\nexport const PercentTypeProvider = props => (\\n  <DataTypeProvider\\n    formatterComponent={Formatter}\\n    editorComponent={Editor}\\n    availableFilterOperations={availableFilterOperations}\\n    {...props}\\n  />\\n);\\n\""
    },
    "progress-bar-cell": {
      "progress-bar-cell.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\nimport {\\n  OverlayTrigger,\\n  Tooltip,\\n} from 'react-bootstrap';\\n\\nexport const ProgressBarCell = ({ value, style }) => {\\n  const percent = value * 100;\\n  return (\\n    <td style={{ position: 'relative', ...style }}>\\n      <div\\n        className=\\\"progress\\\"\\n        style={{\\n          backgroundColor: 'transparent',\\n          boxShadow: 'none',\\n          margin: 0,\\n          borderRadius: 0,\\n        }}\\n      >\\n        <OverlayTrigger\\n          placement=\\\"top\\\"\\n          overlay={(\\n            <Tooltip id=\\\"progress-bar-cell-tooltip\\\">\\n              {percent.toFixed(1)}\\n              %\\n            </Tooltip>\\n)}\\n        >\\n          <div\\n            className=\\\"progress-bar\\\"\\n            role=\\\"progressbar\\\"\\n            aria-valuenow={percent.toFixed()}\\n            aria-valuemin=\\\"0\\\"\\n            aria-valuemax=\\\"100\\\"\\n            style={{ width: `${percent}%` }}\\n          >\\n            <span className=\\\"sr-only\\\">\\n              {percent.toFixed()}\\n              %\\n            </span>\\n          </div>\\n        </OverlayTrigger>\\n      </div>\\n    </td>\\n  );\\n};\\n\\nProgressBarCell.propTypes = {\\n  value: PropTypes.number.isRequired,\\n  style: PropTypes.object,\\n};\\nProgressBarCell.defaultProps = {\\n  style: {},\\n};\\n\""
    }
  },
  "bootstrap4": {
    "boolean-type-provider": {
      "boolean-type-provider.jsx": "\"import * as React from 'react';\\nimport { DataTypeProvider } from '@devexpress/dx-react-grid';\\n\\nconst Formatter = ({ value }) => (value ? 'Yes' : 'No');\\n\\nexport const BooleanTypeProvider = props => (\\n  <DataTypeProvider\\n    formatterComponent={Formatter}\\n    {...props}\\n  />\\n);\\n\""
    },
    "currency-type-provider": {
      "currency-type-provider.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\nimport { DataTypeProvider } from '@devexpress/dx-react-grid';\\n\\nconst getInputValue = value => (value === undefined ? '' : value);\\n\\nconst Editor = ({ value, onValueChange }) => {\\n  const handleChange = (event) => {\\n    const { value: targetValue } = event.target;\\n    if (targetValue.trim() === '') {\\n      onValueChange();\\n      return;\\n    }\\n    onValueChange(parseInt(targetValue, 10));\\n  };\\n  return (\\n    <input\\n      type=\\\"number\\\"\\n      className=\\\"form-control text-right\\\"\\n      placeholder=\\\"Filter...\\\"\\n      value={getInputValue(value)}\\n      min={0}\\n      onChange={handleChange}\\n    />\\n  );\\n};\\n\\nEditor.propTypes = {\\n  value: PropTypes.number,\\n  onValueChange: PropTypes.func.isRequired,\\n};\\n\\nEditor.defaultProps = {\\n  value: undefined,\\n};\\n\\nconst Formatter = ({ value }) => `$${value}`;\\n\\nconst availableFilterOperations = [\\n  'equal', 'notEqual',\\n  'greaterThan', 'greaterThanOrEqual',\\n  'lessThan', 'lessThanOrEqual',\\n];\\n\\nexport const CurrencyTypeProvider = props => (\\n  <DataTypeProvider\\n    formatterComponent={Formatter}\\n    editorComponent={Editor}\\n    availableFilterOperations={availableFilterOperations}\\n    {...props}\\n  />\\n);\\n\""
    },
    "highlighted-cell": {
      "highlighted-cell.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\n\\nconst getColor = (amount) => {\\n  if (amount < 3000) {\\n    return '#fc7a76';\\n  }\\n  if (amount < 5000) {\\n    return '#ffb294';\\n  }\\n  if (amount < 8000) {\\n    return '#ffd59f';\\n  }\\n  return '#c3e2b7';\\n};\\n\\nexport const HighlightedCell = ({\\n  tableColumn, value, children, style,\\n}) => (\\n  <td\\n    style={{\\n      backgroundColor: getColor(value),\\n      textAlign: tableColumn.align,\\n      ...style,\\n    }}\\n  >\\n    {children}\\n  </td>\\n);\\nHighlightedCell.propTypes = {\\n  value: PropTypes.number.isRequired,\\n  tableColumn: PropTypes.object,\\n  style: PropTypes.object,\\n  children: PropTypes.node,\\n};\\nHighlightedCell.defaultProps = {\\n  style: {},\\n  tableColumn: {},\\n  children: undefined,\\n};\\n\""
    },
    "loading": {
      "loading.css": "\".loading-shading {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  width: 100%;\\n  height: 100%;\\n\\n  background: rgba(255, 255, 255, .3);\\n}\\n\\n.loading-icon {\\n  position: absolute;\\n  font-size: 25px;\\n  top: calc(45% - 10px);\\n  left: calc(50% - 10px);\\n\\n  -animation: spin .7s infinite linear;\\n  -webkit-animation: spin2 .7s infinite linear;\\n}\\n\\n@-webkit-keyframes spin2 {\\n  from { -webkit-transform: rotate(360deg); }\\n  to { -webkit-transform: rotate(0deg); }\\n}\\n\\n@keyframes spin {\\n  from { transform: scale(1) rotate(360deg); }\\n  to { transform: scale(1) rotate(0deg); }\\n}\\n\"",
      "loading.jsx": "\"import * as React from 'react';\\nimport './loading.css';\\n\\nexport const Loading = () => (\\n  <div className=\\\"loading-shading\\\">\\n    <div className=\\\"loading-icon\\\">\\n      <span className=\\\"oi oi-loop-circular\\\" />\\n    </div>\\n  </div>\\n);\\n\""
    },
    "percent-type-provider": {
      "percent-type-provider.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\nimport { DataTypeProvider } from '@devexpress/dx-react-grid';\\n\\nconst getInputValue = value => (value === undefined ? '' : (value * 100).toFixed(1));\\n\\nconst Formatter = ({ value }) => `${getInputValue(value)}%`;\\n\\nconst Editor = ({ value, onValueChange }) => {\\n  const handleChange = (event) => {\\n    const { value: targetValue } = event.target;\\n    if (targetValue === '') {\\n      onValueChange();\\n      return;\\n    }\\n    onValueChange(Math.min(Math.max(parseFloat(targetValue / 100), 0), 1));\\n  };\\n  return (\\n    <input\\n      type=\\\"number\\\"\\n      className=\\\"form-control text-right\\\"\\n      placeholder=\\\"Filter...\\\"\\n      value={getInputValue(value)}\\n      step={0.1}\\n      min={0}\\n      max={100}\\n      onChange={handleChange}\\n    />\\n  );\\n};\\n\\nEditor.propTypes = {\\n  value: PropTypes.number,\\n  onValueChange: PropTypes.func.isRequired,\\n};\\n\\nEditor.defaultProps = {\\n  value: undefined,\\n};\\n\\nconst availableFilterOperations = [\\n  'equal', 'notEqual',\\n  'greaterThan', 'greaterThanOrEqual',\\n  'lessThan', 'lessThanOrEqual',\\n];\\n\\nexport const PercentTypeProvider = props => (\\n  <DataTypeProvider\\n    formatterComponent={Formatter}\\n    editorComponent={Editor}\\n    availableFilterOperations={availableFilterOperations}\\n    {...props}\\n  />\\n);\\n\""
    },
    "progress-bar-cell": {
      "progress-bar-cell.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\n\\nexport const ProgressBarCell = ({ value, style }) => {\\n  const percent = value * 100;\\n  return (\\n    <td style={{ position: 'relative', ...style, verticalAlign: 'inherit' }}>\\n      <div\\n        className=\\\"progress\\\"\\n        style={{\\n          backgroundColor: 'transparent',\\n          boxShadow: 'none',\\n          margin: 0,\\n          borderRadius: 0,\\n        }}\\n      >\\n        <div\\n          className=\\\"progress-bar\\\"\\n          role=\\\"progressbar\\\"\\n          aria-valuenow={percent.toFixed()}\\n          aria-valuemin=\\\"0\\\"\\n          aria-valuemax=\\\"100\\\"\\n          style={{ width: `${percent}%` }}\\n          title={`${percent.toFixed(1)}%`}\\n        />\\n      </div>\\n    </td>\\n  );\\n};\\nProgressBarCell.propTypes = {\\n  value: PropTypes.number.isRequired,\\n  style: PropTypes.object,\\n};\\nProgressBarCell.defaultProps = {\\n  style: {},\\n};\\n\""
    }
  },
  "material-ui": {
    "boolean-type-provider": {
      "boolean-type-provider.jsx": "\"import * as React from 'react';\\nimport { DataTypeProvider } from '@devexpress/dx-react-grid';\\n\\nconst Formatter = ({ value }) => (value ? 'Yes' : 'No');\\n\\nexport const BooleanTypeProvider = props => (\\n  <DataTypeProvider\\n    formatterComponent={Formatter}\\n    {...props}\\n  />\\n);\\n\""
    },
    "currency-type-provider": {
      "currency-type-provider.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\nimport Input from '@material-ui/core/Input';\\nimport { withStyles } from '@material-ui/core/styles';\\nimport { DataTypeProvider } from '@devexpress/dx-react-grid';\\n\\nconst styles = {\\n  numericInput: {\\n    textAlign: 'right',\\n    width: '100%',\\n  },\\n};\\n\\nconst getInputValue = value => (value === undefined ? '' : value);\\n\\nconst EditorBase = ({ value, onValueChange, classes }) => {\\n  const handleChange = (event) => {\\n    const { value: targetValue } = event.target;\\n    if (targetValue.trim() === '') {\\n      onValueChange();\\n      return;\\n    }\\n    onValueChange(parseInt(targetValue, 10));\\n  };\\n  return (\\n    <Input\\n      type=\\\"number\\\"\\n      classes={{\\n        input: classes.numericInput,\\n      }}\\n      fullWidth\\n      value={getInputValue(value)}\\n      inputProps={{\\n        min: 0,\\n        placeholder: 'Filter...',\\n      }}\\n      onChange={handleChange}\\n    />\\n  );\\n};\\n\\nEditorBase.propTypes = {\\n  value: PropTypes.number,\\n  onValueChange: PropTypes.func.isRequired,\\n  classes: PropTypes.object.isRequired,\\n};\\n\\nEditorBase.defaultProps = {\\n  value: undefined,\\n};\\n\\nconst Editor = withStyles(styles)(EditorBase);\\n\\nconst Formatter = ({ value }) => `$${value}`;\\n\\nconst availableFilterOperations = [\\n  'equal', 'notEqual',\\n  'greaterThan', 'greaterThanOrEqual',\\n  'lessThan', 'lessThanOrEqual',\\n];\\n\\nexport const CurrencyTypeProvider = props => (\\n  <DataTypeProvider\\n    formatterComponent={Formatter}\\n    editorComponent={Editor}\\n    availableFilterOperations={availableFilterOperations}\\n    {...props}\\n  />\\n);\\n\""
    },
    "highlighted-cell": {
      "highlighted-cell.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\nimport TableCell from '@material-ui/core/TableCell';\\nimport { withStyles } from '@material-ui/core/styles';\\n\\nconst getColor = (amount) => {\\n  if (amount < 3000) {\\n    return '#F44336';\\n  }\\n  if (amount < 5000) {\\n    return '#FFC107';\\n  }\\n  if (amount < 8000) {\\n    return '#FF5722';\\n  }\\n  return '#009688';\\n};\\n\\nconst styles = theme => ({\\n  highlightedCell: {\\n    paddingLeft: theme.spacing.unit,\\n    paddingRight: theme.spacing.unit,\\n  },\\n});\\n\\nconst HighlightedCellBase = ({\\n  tableColumn, value, classes, children, style,\\n}) => (\\n  <TableCell\\n    className={classes.highlightedCell}\\n    style={{\\n      color: getColor(value),\\n      textAlign: tableColumn.align,\\n      ...style,\\n    }}\\n  >\\n    {children}\\n  </TableCell>\\n);\\n\\nHighlightedCellBase.propTypes = {\\n  value: PropTypes.number.isRequired,\\n  classes: PropTypes.object.isRequired,\\n  style: PropTypes.object,\\n  tableColumn: PropTypes.object,\\n  children: PropTypes.node,\\n};\\nHighlightedCellBase.defaultProps = {\\n  style: {},\\n  tableColumn: {},\\n  children: undefined,\\n};\\n\\nexport const HighlightedCell = withStyles(styles, { name: 'HighlightedCell' })(HighlightedCellBase);\\n\""
    },
    "loading": {
      "loading.css": "\".loading-shading-mui {\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  width: 100%;\\n  height: 100%;\\n\\n  background: rgba(255, 255, 255, .3);\\n}\\n\\n.loading-icon-mui {\\n  position: absolute;\\n  font-size: 20px;\\n  top: calc(45% - 10px);\\n  left: calc(50% - 10px);\\n}\\n\"",
      "loading.jsx": "\"import * as React from 'react';\\nimport CircularProgress from '@material-ui/core/CircularProgress';\\n\\nimport './loading.css';\\n\\nexport const Loading = () => (\\n  <div className=\\\"loading-shading-mui\\\">\\n    <CircularProgress className=\\\"loading-icon-mui\\\" />\\n  </div>\\n);\\n\""
    },
    "percent-type-provider": {
      "percent-type-provider.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\nimport Input from '@material-ui/core/Input';\\nimport { withStyles } from '@material-ui/core/styles';\\nimport { DataTypeProvider } from '@devexpress/dx-react-grid';\\n\\nconst styles = {\\n  numericInput: {\\n    textAlign: 'right',\\n    width: '100%',\\n  },\\n};\\n\\nconst getInputValue = value => (value === undefined ? '' : (value * 100).toFixed(1));\\n\\nconst Formatter = ({ value }) => `${getInputValue(value)}%`;\\n\\nconst EditorBase = ({ value, onValueChange, classes }) => {\\n  const handleChange = (event) => {\\n    const { value: targetValue } = event.target;\\n    if (targetValue === '') {\\n      onValueChange();\\n      return;\\n    }\\n    onValueChange(Math.min(Math.max(parseFloat(targetValue / 100), 0), 1));\\n  };\\n  return (\\n    <Input\\n      type=\\\"number\\\"\\n      classes={{\\n        input: classes.numericInput,\\n      }}\\n      fullWidth\\n      value={getInputValue(value)}\\n      inputProps={{\\n        step: 0.1,\\n        min: 0,\\n        max: 100,\\n        placeholder: 'Filter...',\\n      }}\\n      onChange={handleChange}\\n    />\\n  );\\n};\\n\\nEditorBase.propTypes = {\\n  value: PropTypes.number,\\n  onValueChange: PropTypes.func.isRequired,\\n  classes: PropTypes.object.isRequired,\\n};\\n\\nEditorBase.defaultProps = {\\n  value: undefined,\\n};\\n\\nconst Editor = withStyles(styles)(EditorBase);\\n\\nconst availableFilterOperations = [\\n  'equal', 'notEqual',\\n  'greaterThan', 'greaterThanOrEqual',\\n  'lessThan', 'lessThanOrEqual',\\n];\\n\\nexport const PercentTypeProvider = props => (\\n  <DataTypeProvider\\n    formatterComponent={Formatter}\\n    editorComponent={Editor}\\n    availableFilterOperations={availableFilterOperations}\\n    {...props}\\n  />\\n);\\n\""
    },
    "progress-bar-cell": {
      "progress-bar-cell.jsx": "\"import * as React from 'react';\\nimport * as PropTypes from 'prop-types';\\nimport TableCell from '@material-ui/core/TableCell';\\nimport { withStyles } from '@material-ui/core/styles';\\n\\nconst styles = theme => ({\\n  progressBarCell: {\\n    paddingLeft: theme.spacing.unit,\\n    paddingRight: theme.spacing.unit,\\n  },\\n  progressBar: {\\n    backgroundColor: theme.palette.primary.light,\\n    float: 'left',\\n    height: theme.spacing.unit,\\n  },\\n});\\n\\nconst ProgressBarCellBase = ({ value, classes, style }) => {\\n  const percent = value * 100;\\n  return (\\n    <TableCell\\n      className={classes.progressBarCell}\\n      style={style}\\n    >\\n      <div\\n        className={classes.progressBar}\\n        style={{ width: `${percent}%` }}\\n        title={`${percent.toFixed(1)}%`}\\n      />\\n    </TableCell>\\n  );\\n};\\n\\nProgressBarCellBase.propTypes = {\\n  value: PropTypes.number.isRequired,\\n  classes: PropTypes.object.isRequired,\\n  style: PropTypes.object,\\n};\\nProgressBarCellBase.defaultProps = {\\n  style: {},\\n};\\n\\nexport const ProgressBarCell = withStyles(styles, { name: 'ProgressBarCell' })(ProgressBarCellBase);\\n\""
    }
  }
}
;
