import React from 'react';

interface Props {
  options: string[];
}

export function FormTusnsFailed(props: Props) {
  const { options } = props;
  return (
    <select
      style={{
        width: '100%',
        height: 200,
        border: '1px solid rgb(217, 217, 217)',
        padding: 11,
        overflow: 'auto'
      }}
      multiple={true}
    >
      {
        options.map(item => {
          return (
            <option value={item} key={item}>{item}</option>
          )
        })
      }
    </select>
  )
}