import ReportGroupCard from './ReportGroupCard'

export default function ReportGroupTable({
  groups,
  expandedRows,
  onToggleExpand,
  onApproveGroup,
  onRejectGroup,
  onRejectReport,
  onImageClick,
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Prioritas Pemeriksaan Laporan</h2>
        <p>
          Tingkat kepercayaan membantu menentukan prioritas admin berdasarkan dukungan lokasi dan
          waktu; keputusan akhir tetap dilakukan admin.
        </p>
      </div>

      <div className="group-table">
        {groups.map((group) => {
          const expanded = expandedRows.includes(group.id)

          return (
            <ReportGroupCard
              key={group.id}
              group={group}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              onApproveGroup={onApproveGroup}
              onRejectGroup={onRejectGroup}
              onRejectReport={onRejectReport}
              onImageClick={onImageClick}
            />
          )
        })}
      </div>
    </div>
  )
}
