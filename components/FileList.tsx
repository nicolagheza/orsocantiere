// components/FileList.js
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function FileList() {
  const [files, setFiles] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase.storage
        .from("documents")
        .list("public");

      if (data) setFiles(data);
    };

    fetchFiles();
  }, []);

  return (
    <div>
      {files.map((file) => (
        <div key={file.id}>
          <a
            href={
              supabase.storage
                .from("documents")
                .getPublicUrl(`public/${file.name}`).data.publicUrl
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {file.name}
          </a>
        </div>
      ))}
    </div>
  );
}
