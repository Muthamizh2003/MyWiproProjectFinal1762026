import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="d-flex flex-column align-items-center justify-content-center p-5" style={{ minHeight: 400 }}>
          <div className="text-danger fs-1 fw-bold mb-3">!</div>
          <h4 className="fw-bold mb-2">Something went wrong</h4>
          <p className="text-muted mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button onClick={() => window.location.reload()} className="btn btn-pizza">
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
