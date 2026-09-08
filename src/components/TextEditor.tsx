import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
function Quill({ value, onChange }) {
  return (
    <div className="">
      <ReactQuill
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' },
            ],
            [{ direction: 'rtl' }],
          ],
        }}
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Quill;
