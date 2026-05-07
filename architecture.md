# Aegis-Infer: LLM Inference Engine Architecture

## Executive Summary
Aegis-Infer is a highly optimized, cross-platform Large Language Model (LLM) inference engine designed specifically for resource-constrained environments. The engine prioritizes democratizing access to modern AI capabilities by ensuring robust performance on modern consumer GPUs while maintaining functional compatibility with severely outdated legacy hardware, such as decade-old AMD A6 APUs.

## 1. Core Software Architecture

To bypass vendor lock-in (e.g., CUDA) and guarantee compatibility across a vast spectrum of hardware, Aegis-Infer utilizes a layered architecture built on open, cross-platform compute APIs.

### 1.1 Compute API Abstraction Layer (CAAL)
The foundation of the engine is the CAAL, which abstracts the underlying hardware and compute APIs.
- **Primary Backend (Vulkan):** Vulkan serves as the primary compute backend due to its low-overhead, explicit GPU control, and near-universal support across modern and semi-modern discrete and integrated GPUs.
- **Legacy Fallback (OpenCL 1.2+):** For older hardware that lacks Vulkan support (e.g., older AMD APUs and Intel HD Graphics), an OpenCL backend acts as the critical fallback. OpenCL 1.2 is explicitly targeted for maximum backward compatibility.
- **CPU Backend (SIMD Optimized):** A highly optimized CPU backend leveraging AVX2, AVX-512, or ARM NEON instructions for systems completely devoid of usable GPU compute capabilities.

### 1.2 Compute Graph and Scheduler
The inference workload is represented as a dynamic compute graph. An intelligent scheduler evaluates the available hardware pool (CPU, iGPU, dGPU) during initialization and dynamically assigns tensor operations based on theoretical throughput and available memory bandwidth.

## 2. Extreme Memory Management

Running modern LLMs on constrained hardware requires aggressive memory optimization strategies.

### 2.1 Aggressive Quantization
- **Weight Quantization:** Support for dynamic and static weight quantization down to 4-bit (AWQ/GPTQ) and experimental 2-bit formats.
- **Activation Quantization:** 8-bit integer (INT8) activations are used during matrix multiplications to reduce memory bandwidth bottlenecks, falling back to FP16/FP32 accumulation only when precision guarantees are required.
- **Zero-Point Compression:** Implementation of asymmetric quantization to efficiently map outlier weights, preserving model quality at ultra-low bitrates.

### 2.2 Dynamic CPU/GPU Layer Offloading
- **Memory-Aware Partitioning:** The engine actively monitors VRAM/RAM utilization. If a model exceeds available VRAM, Aegis-Infer automatically partitions the model. The most compute-intensive layers (typically earlier layers) reside in VRAM, while the remaining layers are processed sequentially on the CPU/System RAM.
- **Pipelined Transfer:** To minimize PCIe bottleneck latency, tensor transfers between system RAM and VRAM are pipelined asynchronously alongside compute operations.

### 2.3 Efficient KV Cache Handling
- **Paged Attention:** Implementation of Paged KV Caching (similar to vLLM) to virtually eliminate memory fragmentation and allow dynamic allocation of KV tokens on a block-by-block basis.
- **KV Cache Quantization:** Storing the KV cache in 8-bit or 4-bit formats to drastically reduce the VRAM footprint of long-context generations.
- **KV Cache Offloading:** When VRAM is critically low, older or less frequently accessed KV cache blocks are evicted to system RAM or even fast NVMe storage, pre-fetching them back into VRAM asynchronously when needed.

## 3. Technical Roadmap & Implementation Strategy

### 3.1 Language Selection: Rust and C/C++
- **Core Engine (Rust):** The primary orchestration, scheduling, and API layer will be written in Rust. Rust's memory safety guarantees, fearless concurrency, and zero-cost abstractions make it ideal for the highly concurrent nature of LLM scheduling.
- **Compute Kernels (C/C++ & Assembly):** Low-level compute kernels (Vulkan shaders in GLSL/HLSL compiled to SPIR-V, and OpenCL C kernels) require granular control. Platform-specific SIMD optimizations (AVX/NEON) will be implemented in C/C++ or raw assembly for absolute maximum throughput.

### 3.2 Legacy Hardware Fallback Mechanisms
To guarantee stable token generation on severely outdated consumer hardware (e.g., AMD A6 APUs):
1. **API Downgrade:** If Vulkan initialization fails, instantly fallback to OpenCL. If OpenCL context creation fails, fallback to pure CPU execution.
2. **Sub-Warp Batching:** Legacy GPUs often suffer from divergent execution paths. Kernels for older hardware are rewritten to minimize branching and utilize smaller work-group sizes.
3. **Aggressive Swapping:** On systems with minimal system RAM (e.g., 4GB or 8GB shared), the engine will enforce aggressive memory-mapping (mmap) of model weights directly from disk, loading only the necessary layers for a single matrix multiplication pass into memory, explicitly trading generation speed (TPS) for functional stability (avoiding Out-Of-Memory crashes).
4. **Thermal Throttling Awareness:** Legacy APUs quickly thermal throttle under sustained load. The engine will implement an optional "Eco Mode" that introduces micro-sleeps between layer executions to prevent system lockups due to overheating.

## Conclusion
Aegis-Infer provides a resilient, highly scalable approach to LLM inference. By combining open compute standards, aggressive memory optimization, and safe, performant systems languages, the engine bridges the gap between state-of-the-art AI and accessible, ubiquitous computing hardware.
