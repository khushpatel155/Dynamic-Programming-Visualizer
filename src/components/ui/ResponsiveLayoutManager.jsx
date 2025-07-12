import React, { useState, useEffect, createContext, useContext } from 'react';

const LayoutContext = createContext();

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a ResponsiveLayoutManager');
  }
  return context;
};

const ResponsiveLayoutManager = ({ children, algorithmType = 'recursive' }) => {
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState('default');

  // Breakpoint detection
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Layout mode based on algorithm type and breakpoint
  useEffect(() => {
    if (breakpoint === 'mobile') {
      setLayoutMode('stacked');
    } else if (breakpoint === 'tablet') {
      setLayoutMode('adaptive');
    } else {
      setLayoutMode('default');
    }
  }, [breakpoint, algorithmType]);

  // Auto-close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (breakpoint === 'mobile' && sidebarOpen) {
        const sidebar = document.getElementById('responsive-sidebar');
        if (sidebar && !sidebar.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [breakpoint, sidebarOpen]);

  const layoutConfig = {
    breakpoint,
    layoutMode,
    sidebarOpen,
    setSidebarOpen,
    
    // Layout calculations
    getMainContentClasses: () => {
      const baseClasses = 'transition-educational';
      
      switch (layoutMode) {
        case 'stacked':
          return `${baseClasses} pt-16 pb-4`; // Account for fixed header
        case 'adaptive':
          return `${baseClasses} pt-16 pb-4 px-4`;
        default:
          return `${baseClasses} pt-16 pb-4 px-4 lg:px-8`;
      }
    },

    getVisualizationClasses: () => {
      const baseClasses = 'bg-surface rounded-lg shadow-educational border border-border';

      switch (layoutMode) {
        case 'stacked':
          return `${baseClasses} w-full mb-4`;
        case 'adaptive':
          return `${baseClasses} w-full mb-6`;
        default:
          return `${baseClasses} w-full`;
      }
    },

    getControlPanelClasses: () => {
      const baseClasses = 'bg-surface border border-border rounded-lg shadow-educational';
      
      switch (layoutMode) {
        case 'stacked':
          return `${baseClasses} w-full mb-4 p-4`;
        case 'adaptive':
          return `${baseClasses} w-full mb-6 p-4`;
        default:
          return `${baseClasses} w-80 p-4 h-fit`;
      }
    },

    getGridClasses: () => {
      switch (layoutMode) {
        case 'stacked':
          return 'flex flex-col space-y-4';
        case 'adaptive':
          return 'flex flex-col space-y-6';
        default:
          return 'flex flex-col lg:flex-row lg:space-x-6 lg:space-y-0 space-y-6';
      }
    },

    // Responsive utilities
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    
    // Algorithm-specific layout adjustments
    getAlgorithmLayoutConfig: () => {
      const configs = {
        recursive: {
          showTreeView: true,
          showCallStack: breakpoint !== 'mobile',
          defaultPanelWidth: breakpoint === 'desktop' ? '320px' : '100%'
        },
        memoization: {
          showCacheTable: true,
          showTreeView: breakpoint !== 'mobile',
          defaultPanelWidth: breakpoint === 'desktop' ? '280px' : '100%'
        },
        tabulation: {
          showDPTable: true,
          showIterationSteps: true,
          defaultPanelWidth: breakpoint === 'desktop' ? '300px' : '100%'
        }
      };
      
      return configs[algorithmType] || configs.recursive;
    }
  };

  return (
    <LayoutContext.Provider value={layoutConfig}>
      <div className="min-h-screen bg-background">
        {/* Mobile sidebar overlay */}
        {breakpoint === 'mobile' && sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />
        )}
        
        {/* Main layout container */}
        <div className={layoutConfig.getMainContentClasses()}>
          <main className="w-full">
            {/* Responsive grid container */}
            <div className={layoutConfig.getGridClasses()}>
              {children}
            </div>
          </main>
        </div>


      </div>
    </LayoutContext.Provider>
  );
};

// Layout component wrappers for common patterns
export const VisualizationPanel = ({ children, title, onExpand }) => {
  const { getVisualizationClasses, isMobile } = useLayout();

  return (
    <div className={getVisualizationClasses()}>
      {title && (
        <div className="flex items-center p-4 border-b border-border">
          <h3 className="text-heading-sm text-text-primary">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export const ControlPanel = ({ children, title }) => {
  const { getControlPanelClasses } = useLayout();

  return (
    <div className={getControlPanelClasses()}>
      {title && (
        <div className="mb-4 pb-4 border-b border-border">
          <h3 className="text-heading-sm text-text-primary">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default ResponsiveLayoutManager;