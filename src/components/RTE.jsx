import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

function RTE({ name, label, control, defaultValue = "" }) {
    //here using controller instead of forwardRef here control do the ref things which passess controls to parent form
  return (
    <div className="w-full relative">
      {label && <label className="font-semibold mb-2">{label}</label>}
      <Controller
        name={name || "content"}
        control={control}
        //render took an callback function inside field object contains all necessary props(value, onChange, etc.) and inside function body writes the element
        render={({ field: { onChange } }) => (
          <Editor
            apiKey="fvjlbzpag6twe8razh7hxvhr7x48gv41u7gei3xv9uctbbrq"
            initialValue={defaultValue}
            init={{
              height:300,
              menubar: true,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',

            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onEditorChange={onChange}
          />
        )}
        
      />
    </div>
  );
}

export default RTE;
