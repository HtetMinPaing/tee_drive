import ActionsDropdown from "@/components/ActionsDropdown";
import Chart from "@/components/Chart";
import FormattedDateTime from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { getFiles, getTotalSpaceUsed } from "@/lib/action/file.action";
import { convertFileSize, formatDateTime, getUsageSummary } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const [recentFiles, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);
  const usageSummarys = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container">
      <div>
        <Chart usageSummarys={usageSummarys} />
        <div className="dashboard-summary-list">
          {usageSummarys.map((usageSummary) => (
            <Link key={usageSummary.title} href={usageSummary.url}>
              <div className="dashboard-summary-card">
                <Image
                  src={usageSummary.icon}
                  alt={usageSummary.title}
                  height={24}
                  width={24}
                  className="summary-type-icon"
                />
                <div className="summary-type-size">
                  {convertFileSize(usageSummary.size)}
                </div>
                <div className="pt-5">
                  <p className="summary-type-title py-2.5">
                    {usageSummary.title}
                  </p>
                  <p className="py-2.5 text-center text-slate-300 ">
                    {formatDateTime(usageSummary.latestDate)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <ul className="dashboard-recent-files">
        {recentFiles.documents.length > 0 ? (
          recentFiles.documents.map((file) => (
            <li key={file.$id} className="recent-file-details">
              <Link
                href={file.url}
                target="_blank"
                className="flex cursor-pointer items-center gap-4"
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                  className="size-9 min-w-9"
                />
                <div>
                  <p className="recent-file-name">{file.name}</p>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="recent-file-date"
                  />
                </div>
              </Link>
              <ActionsDropdown file={file} />
            </li>
          ))
        ) : (
          <p className="empty-list">No files found</p>
        )}
      </ul>
    </div>
  );
}
