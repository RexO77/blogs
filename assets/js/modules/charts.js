/**
 * Charts Module
 * Modern, accessible, and theme-aware chart management
 */

export class ChartManager {
  constructor(container) {
    this.container = container;
    this.charts = new Map();
    this.chartConfig = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: 'Satoshi',
              size: 14
            }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            family: 'Satoshi',
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: 'Satoshi',
            size: 13
          },
          cornerRadius: 8,
          padding: 12
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutCubic'
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    };
    
    this.colors = {
      primary: '#0099ff',
      secondary: '#ffd700',
      success: '#10b981',
      danger: '#ef4444',
      warning: '#f59e0b',
      purple: '#8b5cf6',
      gray: '#6b7280'
    };
  }

  /**
   * Initialize chart manager
   */
  async init() {
    try {
      // Load Chart.js dynamically
      await this.loadChartJS();
      
      // Setup intersection observer for performance
      this.setupIntersectionObserver();
      
      // Listen for theme changes
      this.setupThemeListener();
      
    } catch (error) {
      console.error('Failed to initialize ChartManager:', error);
    }
  }

  /**
   * Load Chart.js library dynamically
   */
  async loadChartJS() {
    if (window.Chart) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Setup intersection observer for lazy loading
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      this.initializeCharts();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.initializeCharts();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '50px'
    });

    observer.observe(this.container);
  }

  /**
   * Initialize all charts in the container
   */
  initializeCharts() {
    const canvases = this.container.querySelectorAll('canvas[data-chart-type]');
    
    canvases.forEach(canvas => {
      const chartType = canvas.dataset.chartType;
      const chartId = canvas.id;
      
      if (this.charts.has(chartId)) return; // Already initialized
      
      try {
        const chart = this.createChart(canvas, chartType);
        if (chart) {
          this.charts.set(chartId, chart);
        }
      } catch (error) {
        console.error(`Failed to create ${chartType} chart:`, error);
      }
    });
  }

  /**
   * Create chart based on type
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {string} type - Chart type
   * @returns {Chart|null} Chart instance
   */
  createChart(canvas, type) {
    const ctx = canvas.getContext('2d');
    const themeColors = this.getThemeColors();
    
    switch (type) {
      case 'memory':
        return this.createMemoryChart(ctx, themeColors);
      case 'addiction':
        return this.createAddictionChart(ctx, themeColors);
      case 'platforms':
        return this.createPlatformChart(ctx, themeColors);
      default:
        console.warn(`Unknown chart type: ${type}`);
        return null;
    }
  }

  /**
   * Create memory performance chart
   */
  createMemoryChart(ctx, themeColors) {
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Light Multitaskers', 'Heavy Multitaskers'],
        datasets: [{
          label: 'Working Memory Score (%)',
          data: [85, 60],
          backgroundColor: [
            this.colors.primary + '99', // 60% opacity
            this.colors.danger + '99'
          ],
          borderColor: [
            this.colors.primary,
            this.colors.danger
          ],
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        ...this.chartConfig,
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: themeColors.text,
              font: {
                family: 'Satoshi',
                size: 12,
                weight: '500'
              }
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: themeColors.grid,
              lineWidth: 1
            },
            ticks: {
              stepSize: 20,
              color: themeColors.text,
              font: {
                family: 'Satoshi',
                size: 11
              },
              callback: function(value) {
                return value + '%';
              }
            }
          }
        },
        plugins: {
          ...this.chartConfig.plugins,
          tooltip: {
            ...this.chartConfig.plugins.tooltip,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}%`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Create addiction awareness chart
   */
  createAddictionChart(ctx, themeColors) {
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Find social media "addicting"', 'Do not find it addicting'],
        datasets: [{
          data: [82, 18],
          backgroundColor: [
            this.colors.danger + 'CC', // 80% opacity
            themeColors.muted + '80'    // 50% opacity
          ],
          borderColor: [
            this.colors.danger,
            themeColors.muted
          ],
          borderWidth: 2,
          hoverBorderWidth: 3
        }]
      },
      options: {
        ...this.chartConfig,
        cutout: '60%',
        layout: {
          padding: 20
        },
        plugins: {
          ...this.chartConfig.plugins,
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              color: themeColors.text,
              font: {
                family: 'Satoshi',
                size: 12,
                weight: '500'
              }
            }
          },
          tooltip: {
            ...this.chartConfig.plugins.tooltip,
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Create platform usage chart
   */
  createPlatformChart(ctx, themeColors) {
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['WhatsApp', 'Instagram', 'Facebook'],
        datasets: [{
          label: 'Usage among internet users (%)',
          data: [80.8, 77.9, 67.8],
          backgroundColor: [
            this.colors.success + '99',
            this.colors.purple + '99',
            this.colors.primary + '99'
          ],
          borderColor: [
            this.colors.success,
            this.colors.purple,
            this.colors.primary
          ],
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        ...this.chartConfig,
        indexAxis: 'y',
        layout: {
          padding: {
            top: 20,
            right: 30,
            bottom: 20,
            left: 20
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: themeColors.grid
            },
            ticks: {
              color: themeColors.text,
              font: {
                family: 'Satoshi',
                size: 11
              },
              callback: function(value) {
                return value + '%';
              }
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: themeColors.text,
              font: {
                family: 'Satoshi',
                size: 12,
                weight: '500'
              }
            }
          }
        },
        plugins: {
          ...this.chartConfig.plugins,
          tooltip: {
            ...this.chartConfig.plugins.tooltip,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.x}%`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Get theme-aware colors
   */
  getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                   (!document.documentElement.getAttribute('data-theme') && 
                    window.matchMedia('(prefers-color-scheme: dark)').matches);

    return {
      text: isDark ? '#e5e7eb' : '#374151',
      muted: isDark ? '#9ca3af' : '#6b7280',
      grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      background: isDark ? '#1a1a1a' : '#ffffff'
    };
  }

  /**
   * Setup theme change listener
   */
  setupThemeListener() {
    // Listen for theme changes
    document.addEventListener('themechange', () => {
      this.updateChartsTheme();
    });

    // Also listen for attribute changes on document element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          this.updateChartsTheme();
        }
      });
    });

    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  /**
   * Update chart colors for theme changes
   */
  updateChartsTheme() {
    const themeColors = this.getThemeColors();
    
    this.charts.forEach((chart) => {
      // Update axis colors
      if (chart.options.scales) {
        Object.keys(chart.options.scales).forEach(scaleKey => {
          const scale = chart.options.scales[scaleKey];
          if (scale.ticks) {
            scale.ticks.color = themeColors.text;
          }
          if (scale.grid) {
            scale.grid.color = themeColors.grid;
          }
        });
      }

      // Update legend colors
      if (chart.options.plugins?.legend?.labels) {
        chart.options.plugins.legend.labels.color = themeColors.text;
      }

      // Update the chart
      chart.update('none'); // No animation for theme changes
    });
  }

  /**
   * Destroy all charts
   */
  destroy() {
    this.charts.forEach((chart) => {
      chart.destroy();
    });
    this.charts.clear();
  }

  /**
   * Get chart instance by ID
   */
  getChart(chartId) {
    return this.charts.get(chartId);
  }

  /**
   * Get all chart instances
   */
  getAllCharts() {
    return Array.from(this.charts.values());
  }
}
