import { CodeEditor } from './CodeEditor.tsx';
import { ControlPanel } from './ControlPanel.tsx';
import { InstructionLibrary } from './InstructionLibrary.tsx';
import { RegisterFile } from './RegisterFile.tsx';
import { MemoryView } from './MemoryView.tsx';
import { PipelineVisualizer } from './PipelineVisualizer.tsx';
import { DataPathDiagram } from './DataPathDiagram.tsx';

const MainView = () => {
    return (
        <div className="flex h-full w-full">
            {/* Left Panel: Editor & Controls */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 flex flex-col min-w-[320px] shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none z-20">
                <div className="flex-1 p-4 border-b border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        Program Input
                    </h2>
                    <CodeEditor />
                </div>
                <div className="h-1/3 min-h-[200px] border-b border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-transparent">
                    <InstructionLibrary />
                </div>
            </div>

            {/* Center Panel: Visualization */}
            <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
                {/* Top: Pipeline Stages */}
                <div className="h-32 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/20 p-4 shadow-sm dark:shadow-none z-10">
                    <PipelineVisualizer />
                </div>
                {/* Main: Data Path */}
                <div className="flex-1 p-6 relative flex items-center justify-center bg-slate-100 dark:bg-transparent">
                    <DataPathDiagram />
                </div>
                {/* Bottom: Controls Overlay or Bar */}
                <div className="h-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 flex items-center justify-center shadow-[0_-4px_24px_rgba(0,0,0,0.02)] dark:shadow-none z-20">
                    <ControlPanel />
                </div>
            </div>

            {/* Right Panel: State */}
            <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 flex flex-col min-w-[300px] shadow-[-4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none z-20">
                <div className="h-1/2 border-b border-slate-200 dark:border-slate-800 p-4 overflow-hidden flex flex-col">
                    <RegisterFile />
                </div>
                <div className="flex-1 p-4 overflow-hidden flex flex-col bg-slate-50/50 dark:bg-transparent">
                    <MemoryView />
                </div>
            </div>
        </div>
    );
};

export default MainView;
