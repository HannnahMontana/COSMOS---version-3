import { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";
import "./ClassicCKEditor.css";

const LICENSE_KEY =
  "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjYxODg3OTksImp0aSI6IjhkYWE4ZDlhLTA2ZDItNDQ3OC05MThmLTYxOTdjNDZmMmRjMyIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIl0sInZjIjoiNTU5YmVmNzIifQ.a79MjSXAf5pL1xRhaxFcL3wQcKeXybwC2iFcGuoNn8oem-IJilA6zp6898z1sRXZafrN4wrusvFgSIFckdfdFA";

export default function ClassicCKEditor({
  onChange,
  initialArticleContent = "",
}) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const editorWordCountRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const cloud = useCKEditorCloud({ version: "44.1.0", translations: ["pl"] });

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const { ClassicEditor, editorConfig } = useMemo(() => {
    if (cloud.status !== "success" || !isLayoutReady) {
      return {};
    }

    const {
      ClassicEditor,
      Autosave,
      BlockQuote,
      Bold,
      Essentials,
      FullPage,
      GeneralHtmlSupport,
      Heading,
      HtmlComment,
      HtmlEmbed,
      Indent,
      IndentBlock,
      Italic,
      Link,
      Paragraph,
      ShowBlocks,
      SourceEditing,
      SpecialCharacters,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextPartLanguage,
      Title,
      Underline,
      WordCount,
    } = cloud.CKEditor;

    return {
      ClassicEditor,
      editorConfig: {
        toolbar: {
          items: [
            "sourceEditing",
            "showBlocks",
            "textPartLanguage",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "specialCharacters",
            "link",
            "insertTable",
            "blockQuote",
            "htmlEmbed",
            "|",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Autosave,
          BlockQuote,
          Bold,
          Essentials,
          FullPage,
          GeneralHtmlSupport,
          Heading,
          HtmlComment,
          HtmlEmbed,
          Indent,
          IndentBlock,
          Italic,
          Link,
          Paragraph,
          ShowBlocks,
          SourceEditing,
          SpecialCharacters,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableProperties,
          TableToolbar,
          TextPartLanguage,
          // Title,
          Underline,
          WordCount,
        ],
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1",
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
            {
              model: "heading5",
              view: "h5",
              title: "Heading 5",
              class: "ck-heading_heading5",
            },
            {
              model: "heading6",
              view: "h6",
              title: "Heading 6",
              class: "ck-heading_heading6",
            },
          ],
        },
        htmlSupport: {
          allow: [
            {
              name: /^.*$/,
              styles: true,
              attributes: true,
              classes: true,
            },
          ],
        },
        initialData: initialArticleContent,
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual",
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },
        placeholder: "Type or paste your content here!",
        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableProperties",
            "tableCellProperties",
          ],
        },
      },
    };
  }, [cloud, isLayoutReady]);

  return (
    <div className="main-container">
      <div
        className="editor-container editor-container_classic-editor editor-container_include-word-count"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor">
          <div ref={editorRef}>
            {ClassicEditor && editorConfig && (
              <CKEditor
                onChange={(event, editor) => {
                  const data = editor.getData();
                  onChange(data);
                }}
                onReady={(editor) => {
                  const wordCount = editor.plugins.get("WordCount");
                  editorWordCountRef.current.appendChild(
                    wordCount.wordCountContainer
                  );
                }}
                onAfterDestroy={() => {
                  Array.from(editorWordCountRef.current.children).forEach(
                    (child) => child.remove()
                  );
                }}
                editor={ClassicEditor}
                config={editorConfig}
              />
            )}
          </div>
        </div>
        <div
          className="editor_container__word-count"
          ref={editorWordCountRef}
        ></div>
      </div>
    </div>
  );
}
